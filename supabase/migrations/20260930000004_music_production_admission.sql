-- Admission/rate/quota/retention: server-only; no browser can bypass the HTTP boundary.
create function public.music_reserve_api(p_slug text,p_visitor_hash text,p_network_hash text,p_operation text,p_units integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid; q private.music_quota; today date; visitor text; network text;
begin
  select id into tenant from public.establishments where slug=p_slug and active for update;
  if tenant is null then return jsonb_build_object('status','unavailable'); end if;
  if not exists(select 1 from public.music_settings where establishment_id=tenant and music_enabled and requests_enabled) then
    return jsonb_build_object('status','disabled'); end if;
  if not private.music_live(tenant) then return jsonb_build_object('status','offline'); end if;
  if p_visitor_hash is null or p_visitor_hash!~'^[a-f0-9]{64}$' or p_network_hash is null or p_network_hash!~'^[a-f0-9]{64}$' or
    p_operation is null or p_operation not in ('search','validate') or p_units is null or p_units not between 1 and 1000 then
    raise exception 'invalid_reservation' using errcode='22023'; end if;
  visitor:=tenant::text||':'||p_visitor_hash; network:=tenant::text||':'||p_network_hash;
  perform private.music_rate_lock();
  if p_operation='validate' then
    if (select count(*) from public.music_requests where establishment_id=tenant and status='queued')>=
      (select queue_limit from public.music_settings where establishment_id=tenant) then return jsonb_build_object('status','full'); end if;
    if not private.music_rate_ok('request-visitor',visitor,1,interval '60 seconds') or
      not private.music_rate_ok('request-visitor',visitor,5,interval '1 hour') or
      not private.music_rate_ok('request-network',network,60,interval '1 minute') then
      return jsonb_build_object('status','limited'); end if;
  end if;
  if not private.music_rate_ok('api-'||p_operation,visitor,5,interval '1 minute') or
    not private.music_rate_ok('api-network',network,60,interval '1 minute') then
    return jsonb_build_object('status','limited'); end if;
  select * into q from private.music_quota where bucket=case when p_operation='search' then 'search' else 'video' end for update;
  if q.bucket is null then return jsonb_build_object('status','quota_exhausted'); end if;
  today:=(clock_timestamp() at time zone 'America/Los_Angeles')::date;
  if q.quota_day is distinct from today then q.used_units:=0; end if;
  if q.used_units+p_units>q.daily_budget then return jsonb_build_object('status','quota_exhausted'); end if;
  update private.music_quota set quota_day=today,used_units=q.used_units+p_units where bucket=q.bucket;
  perform private.music_charge('api-'||p_operation,visitor);
  perform private.music_charge('api-network',network);
  -- Charges are deliberately not refunded when YouTube rejects an API call.
  return jsonb_build_object('status','reserved');
end $$;

create function public.music_request_receipt(p_slug text,p_visitor_hash text,p_retry uuid,p_video text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare receipt private.music_receipts;
begin
  select r.* into receipt from private.music_receipts r join public.establishments e on e.id=r.establishment_id
    where e.slug=p_slug and e.active and r.visitor_hash=p_visitor_hash and r.retry_id=p_retry;
  if receipt.request_id is null then return null; end if;
  if receipt.video_id is distinct from p_video then return jsonb_build_object('status','retry_conflict'); end if;
  return jsonb_build_object('status','accepted','requestId',receipt.request_id);
end $$;

create function public.music_admit_request(p_slug text,p_visitor_hash text,p_network_hash text,p_retry uuid,
  p_video text,p_title text,p_channel text,p_thumbnail text,p_verified_at timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid; receipt jsonb; settings public.music_settings; request_id uuid; visitor text; network text;
begin
  select id into tenant from public.establishments where slug=p_slug and active for update;
  if tenant is null then return jsonb_build_object('status','unavailable'); end if;
  if p_visitor_hash is null or p_visitor_hash!~'^[a-f0-9]{64}$' or p_network_hash is null or p_network_hash!~'^[a-f0-9]{64}$' or p_retry is null then
    raise exception 'invalid_identity' using errcode='22023'; end if;
  receipt:=public.music_request_receipt(p_slug,p_visitor_hash,p_retry,p_video);
  if receipt is not null then return receipt; end if;
  select * into settings from public.music_settings where establishment_id=tenant;
  if not coalesce(settings.music_enabled and settings.requests_enabled,false) then return jsonb_build_object('status','disabled'); end if;
  if not private.music_live(tenant) then return jsonb_build_object('status','offline'); end if;
  if p_video is null or p_video!~'^[A-Za-z0-9_-]{11}$' or p_title is null or btrim(p_title)='' or length(p_title)>500 or
    p_channel is null or btrim(p_channel)='' or length(p_channel)>250 or
    (p_thumbnail is not null and (length(p_thumbnail)>1000 or p_thumbnail!~'^https://i[.]ytimg[.]com/')) or
    p_verified_at is null or p_verified_at>clock_timestamp() or p_verified_at<clock_timestamp()-interval '5 minutes' then
    raise exception 'invalid_metadata' using errcode='22023'; end if;
  if (select count(*) from public.music_requests where establishment_id=tenant and status='queued')>=settings.queue_limit then
    return jsonb_build_object('status','full'); end if;
  visitor:=tenant::text||':'||p_visitor_hash; network:=tenant::text||':'||p_network_hash;
  perform private.music_rate_lock();
  if not private.music_rate_ok('request-visitor',visitor,1,interval '60 seconds') or
    not private.music_rate_ok('request-visitor',visitor,5,interval '1 hour') or
    not private.music_rate_ok('request-network',network,60,interval '1 minute') then return jsonb_build_object('status','limited'); end if;
  insert into public.music_requests(establishment_id,youtube_video_id,title,channel_title,thumbnail_url,metadata_verified_at,requested_at)
    values(tenant,p_video,btrim(p_title),btrim(p_channel),p_thumbnail,p_verified_at,clock_timestamp()) returning id into request_id;
  insert into private.music_receipts(establishment_id,visitor_hash,retry_id,video_id,request_id)
    values(tenant,p_visitor_hash,p_retry,p_video,request_id);
  perform private.music_charge('request-visitor',visitor);
  perform private.music_charge('request-network',network);
  return jsonb_build_object('status','accepted','requestId',request_id);
end $$;

create function public.music_cleanup() returns jsonb
language plpgsql security definer set search_path='' as $$
declare tenant uuid; removed integer:=0; n integer;
begin
  -- Follow the same tenant-first lock order as admission/admin/player operations.
  for tenant in select id from public.establishments order by id loop
    perform 1 from public.establishments where id=tenant for update;
    if exists(select 1 from public.music_requests where establishment_id=tenant and status in ('queued','playing')
      and metadata_verified_at<=clock_timestamp()-interval '30 days') then
      update private.music_leases set current_request_id=null,playback_generation=playback_generation+1
        where establishment_id=tenant and current_request_id in (select id from public.music_requests
          where establishment_id=tenant and metadata_verified_at<=clock_timestamp()-interval '30 days');
      perform private.music_instruction(tenant);
    end if;
    delete from public.music_requests where establishment_id=tenant and metadata_verified_at<=clock_timestamp()-interval '30 days';
    get diagnostics n=row_count; removed:=removed+n;
    delete from private.music_receipts where establishment_id=tenant and created_at<=clock_timestamp()-interval '30 days';
    delete from private.music_pairings where establishment_id=tenant and (expires_at<=clock_timestamp() or consumed_at is not null);
    update private.music_leases set token_hash=null,instance_id=null,boot_id=null,ready=false,expires_at='-infinity',
      lease_generation=lease_generation+1,playback_generation=playback_generation+1
      where establishment_id=tenant and token_hash in (select token_hash from private.music_devices
        where establishment_id=tenant and (expires_at<=clock_timestamp() or revoked_at is not null));
    delete from private.music_devices where establishment_id=tenant and (expires_at<=clock_timestamp() or revoked_at is not null);
  end loop;
  perform private.music_rate_lock();
  delete from private.music_rate_events where occurred_at<=clock_timestamp()-interval '24 hours';
  return jsonb_build_object('removedRequests',removed);
end $$;

revoke all on function public.music_reserve_api(text,text,text,text,integer),public.music_request_receipt(text,text,uuid,text),
  public.music_admit_request(text,text,text,uuid,text,text,text,text,timestamptz),public.music_cleanup() from public,anon,authenticated,service_role;
grant execute on function public.music_reserve_api(text,text,text,text,integer),public.music_request_receipt(text,text,uuid,text),
  public.music_admit_request(text,text,text,uuid,text,text,text,text,timestamptz),public.music_cleanup() to service_role;
