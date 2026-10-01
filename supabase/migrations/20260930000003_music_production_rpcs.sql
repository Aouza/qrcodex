-- All helpers execute as owner with qualified names; never exposed as RPCs.
create function private.music_admin_lock(p_tenant uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
  if not private.is_establishment_member(p_tenant) or
    (select count(*) from public.establishment_users where user_id=auth.uid())<>1 then
    raise exception 'music_forbidden' using errcode='42501';
  end if;
  perform 1 from public.establishments where id=p_tenant and active for update;
  if not found then raise exception 'music_unavailable' using errcode='22023'; end if;
  insert into public.music_settings(establishment_id) values(p_tenant) on conflict do nothing;
end $$;

create function private.music_rate_ok(p_scope text,p_actor text,p_cap integer,p_window interval)
returns boolean language sql security definer set search_path='' as $$
  select count(*) < coalesce((select maximum from private.music_limit_config where scope=p_scope and window_size=p_window),p_cap)
  from private.music_rate_events
  where scope=p_scope and actor=p_actor and occurred_at>clock_timestamp()-p_window;
$$;
create function private.music_charge(p_scope text,p_actor text) returns void
language sql security definer set search_path='' as $$
  insert into private.music_rate_events(scope,actor) values(p_scope,p_actor);
$$;
-- One short project lock for rate/quota reservation; always acquire tenant lock first.
create function private.music_rate_lock() returns void
language sql security definer set search_path='' as $$
  select pg_catalog.pg_advisory_xact_lock(61054,1);
$$;

create function private.music_instruction(p_tenant uuid) returns void
language plpgsql security definer set search_path='' as $$
declare topic text;
begin
  topic:=public.music_player_topic(p_tenant);
  if topic is not null then perform realtime.send('{}'::jsonb,'instruction',topic,false); end if;
end $$;

create function private.music_track(p_tenant uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare r public.music_requests;
begin
  -- Metadata isn't made current by a browser assertion or a schema migration.
  update public.music_requests set status='cancelled',cancelled_at=clock_timestamp()
    where establishment_id=p_tenant and status='queued'
    and metadata_verified_at<=clock_timestamp()-interval '30 days';
  update public.music_requests set status='failed',failed_at=clock_timestamp(),failure_reason='metadata_expired'
    where establishment_id=p_tenant and status='playing'
    and metadata_verified_at<=clock_timestamp()-interval '30 days';
  r:=public.claim_next_music_request(p_tenant);
  update private.music_leases set current_request_id=r.id,
    playback_generation=playback_generation+case when current_request_id is distinct from r.id then 1 else 0 end
    where establishment_id=p_tenant;
  return r.id;
end $$;

create function private.music_response(p_tenant uuid) returns jsonb
language sql security definer set search_path='' as $$
  select jsonb_build_object('status',case when r.id is null then 'waiting' else 'playing' end,
    'leaseGeneration',l.lease_generation,'playbackGeneration',l.playback_generation,
    'leaseExpiresAt',l.expires_at,'topic','music-poc:'||t.topic::text,
    'track',case when r.id is null then null else jsonb_build_object(
      'id',r.id,'videoId',r.youtube_video_id,'title',r.title,'channelTitle',r.channel_title) end)
  from private.music_leases l
  left join public.music_requests r on r.id=l.current_request_id and r.establishment_id=l.establishment_id and r.status='playing'
  left join private.music_player_topics t on t.establishment_id=l.establishment_id
  where l.establishment_id=p_tenant;
$$;

create function private.music_live(p_tenant uuid) returns boolean
language sql security definer set search_path='' as $$
  select exists(select 1 from private.music_leases l join private.music_devices d
    on d.establishment_id=l.establishment_id and d.token_hash=l.token_hash
    where l.establishment_id=p_tenant and l.expires_at>clock_timestamp() and l.ready
    and d.revoked_at is null and d.expires_at>clock_timestamp());
$$;

create function public.music_availability(p_slug text) returns jsonb
language sql security definer set search_path='' as $$
  select jsonb_build_object('enabled',coalesce(s.music_enabled,false),
    'accepting',coalesce(s.music_enabled and s.requests_enabled and private.music_live(e.id),false))
  from public.establishments e left join public.music_settings s on s.establishment_id=e.id
  where e.slug=p_slug and e.active;
$$;

create function public.music_admin_settings(p_tenant uuid,p_enabled boolean,p_requests boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
  perform private.music_admin_lock(p_tenant);
  if p_enabled is null or p_requests is null then raise exception 'invalid_settings' using errcode='22023'; end if;
  update public.music_settings set music_enabled=p_enabled,requests_enabled=p_requests,updated_at=clock_timestamp()
    where establishment_id=p_tenant;
  if not p_enabled then
    update private.music_leases set expires_at='-infinity',ready=false,
      lease_generation=lease_generation+1,playback_generation=playback_generation+1 where establishment_id=p_tenant;
  end if;
  perform private.music_instruction(p_tenant);
end $$;

create function public.music_admin_revoke(p_tenant uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
  perform private.music_admin_lock(p_tenant);
  update private.music_devices set revoked_at=clock_timestamp() where establishment_id=p_tenant and revoked_at is null;
  update private.music_pairings set consumed_at=clock_timestamp() where establishment_id=p_tenant and consumed_at is null;
  update private.music_leases set expires_at='-infinity',ready=false,
    lease_generation=lease_generation+1,playback_generation=playback_generation+1 where establishment_id=p_tenant;
  perform private.music_instruction(p_tenant);
end $$;

create function public.music_admin_pair(p_tenant uuid,p_replace boolean default false) returns text
language plpgsql security definer set search_path='' as $$
declare code text;
begin
  perform private.music_admin_lock(p_tenant);
  if exists(select 1 from private.music_devices where establishment_id=p_tenant
    and revoked_at is null and expires_at>clock_timestamp()) then
    if not coalesce(p_replace,false) then raise exception 'device_already_paired' using errcode='22023'; end if;
    perform public.music_admin_revoke(p_tenant);
  end if;
  perform private.music_rate_lock();
  if not private.music_rate_ok('pair-issue',p_tenant::text,10,interval '1 hour') or
    not private.music_rate_ok('pair-issue-global','global',1000,interval '1 hour') then
    raise exception 'pair_issue_limit' using errcode='22023';
  end if;
  perform private.music_charge('pair-issue',p_tenant::text);
  perform private.music_charge('pair-issue-global','global');
  -- 244 random bits; plaintext returned once to the authorized admin for setup.
  code:=replace(gen_random_uuid()::text||gen_random_uuid()::text,'-','');
  update private.music_pairings set consumed_at=clock_timestamp() where establishment_id=p_tenant and consumed_at is null;
  insert into private.music_pairings(code_hash,establishment_id,expires_at)
    values(encode(sha256(convert_to(code,'UTF8')),'hex'),p_tenant,clock_timestamp()+interval '10 minutes');
  return code;
end $$;

create function public.music_redeem_pair(p_slug text,p_code_hash text,p_token_hash text,p_network_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid; pairing private.music_pairings;
begin
  select id into tenant from public.establishments where slug=p_slug and active for update;
  if tenant is null then return jsonb_build_object('status','unavailable'); end if;
  if p_network_hash is null or p_network_hash!~'^[a-f0-9]{64}$' or
    p_token_hash is null or p_token_hash!~'^[a-f0-9]{64}$' then
    raise exception 'invalid_digest' using errcode='22023';
  end if;
  perform private.music_rate_lock();
  if not private.music_rate_ok('pair-network',p_network_hash,5,interval '10 minutes') or
    not private.music_rate_ok('pair-tenant',tenant::text,50,interval '10 minutes') or
    not private.music_rate_ok('pair-global','global',500,interval '10 minutes') then
    return jsonb_build_object('status','limited');
  end if;
  -- Count all attempts (stricter than failures); return, don't raise/rollback a failed attempt.
  perform private.music_charge('pair-network',p_network_hash);
  perform private.music_charge('pair-tenant',tenant::text);
  perform private.music_charge('pair-global','global');
  select * into pairing from private.music_pairings where code_hash=p_code_hash
    and establishment_id=tenant and consumed_at is null and expires_at>clock_timestamp() for update;
  if pairing.code_hash is null then return jsonb_build_object('status','invalid'); end if;
  if exists(select 1 from private.music_devices where establishment_id=tenant and revoked_at is null
    and expires_at>clock_timestamp()) then return jsonb_build_object('status','already_paired'); end if;
  update private.music_devices set revoked_at=clock_timestamp() where establishment_id=tenant and revoked_at is null;
  update private.music_pairings set consumed_at=clock_timestamp() where code_hash=pairing.code_hash;
  insert into private.music_devices(token_hash,establishment_id,expires_at)
    values(p_token_hash,tenant,clock_timestamp()+interval '30 days');
  update private.music_leases set expires_at='-infinity',ready=false,
    lease_generation=lease_generation+1,playback_generation=playback_generation+1 where establishment_id=tenant;
  perform public.music_player_topic(tenant);
  return jsonb_build_object('status','authorized','tenantId',tenant);
end $$;

create function public.music_player_state(p_slug text,p_token_hash text,p_instance uuid,p_boot uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid; lease private.music_leases;
begin
  select id into tenant from public.establishments where slug=p_slug and active for update;
  if tenant is null then return jsonb_build_object('status','unauthorized'); end if;
  if not exists(select 1 from private.music_devices where establishment_id=tenant and token_hash=p_token_hash
    and revoked_at is null and expires_at>clock_timestamp()) then return jsonb_build_object('status','unauthorized'); end if;
  if not exists(select 1 from public.music_settings where establishment_id=tenant and music_enabled) then
    return jsonb_build_object('status','disabled'); end if;
  if p_instance is null or p_boot is null then raise exception 'invalid_instance' using errcode='22023'; end if;
  insert into private.music_leases(establishment_id) values(tenant) on conflict do nothing;
  select * into lease from private.music_leases where establishment_id=tenant for update;
  if lease.expires_at>clock_timestamp() and (lease.token_hash is distinct from p_token_hash or lease.instance_id is distinct from p_instance) then
    return jsonb_build_object('status','busy'); end if;
  update private.music_leases set token_hash=p_token_hash,instance_id=p_instance,boot_id=p_boot,
    lease_generation=lease_generation+case when lease.boot_id is distinct from p_boot or lease.expires_at<=clock_timestamp() then 1 else 0 end,
    playback_generation=playback_generation+case when lease.boot_id is distinct from p_boot or lease.expires_at<=clock_timestamp() then 1 else 0 end,
    ready=case when lease.boot_id is distinct from p_boot or lease.expires_at<=clock_timestamp() then false else ready end,
    expires_at=clock_timestamp()+interval '90 seconds' where establishment_id=tenant;
  perform public.music_player_topic(tenant);
  perform private.music_track(tenant);
  return private.music_response(tenant);
end $$;

create function private.music_validate_lease(p_slug text,p_hash text,p_instance uuid,p_generation bigint)
returns uuid language plpgsql security definer set search_path='' as $$
declare tenant uuid;
begin
  select id into tenant from public.establishments where slug=p_slug and active for update;
  if tenant is null or not exists(select 1 from private.music_devices d join private.music_leases l
    on l.establishment_id=d.establishment_id and l.token_hash=d.token_hash
    join public.music_settings s on s.establishment_id=d.establishment_id
    where d.establishment_id=tenant and d.token_hash=p_hash and d.revoked_at is null and d.expires_at>clock_timestamp()
    and s.music_enabled and l.instance_id=p_instance and l.lease_generation=p_generation and l.expires_at>clock_timestamp())
    then return null; end if;
  return tenant;
end $$;

create function public.music_player_heartbeat(p_slug text,p_token_hash text,p_instance uuid,p_lease_generation bigint,p_ready boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid;
begin
  tenant:=private.music_validate_lease(p_slug,p_token_hash,p_instance,p_lease_generation);
  if tenant is null then return jsonb_build_object('status','lease_lost'); end if;
  update private.music_leases set expires_at=clock_timestamp()+interval '90 seconds',ready=coalesce(p_ready,false) where establishment_id=tenant;
  perform private.music_track(tenant);
  return private.music_response(tenant);
end $$;

create function public.music_player_event(p_slug text,p_token_hash text,p_instance uuid,p_lease_generation bigint,
  p_playback_generation bigint,p_request uuid,p_event text,p_error integer default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare tenant uuid; lease private.music_leases;
begin
  tenant:=private.music_validate_lease(p_slug,p_token_hash,p_instance,p_lease_generation);
  if tenant is null then return jsonb_build_object('status','lease_lost'); end if;
  if p_event is null or p_event not in ('ended','error') or
    (p_event='error' and (p_error is null or p_error not in (2,5,100,101,150,153))) then
    raise exception 'invalid_event' using errcode='22023'; end if;
  select * into lease from private.music_leases where establishment_id=tenant;
  if p_playback_generation is null or p_playback_generation<>lease.playback_generation or
    p_request is null or p_request is distinct from lease.current_request_id then
    return private.music_response(tenant)||jsonb_build_object('ignored',true); end if;
  if p_event='ended' then
    perform public.mark_music_request_played(tenant,p_request);
  else
    perform public.mark_music_request_failed(tenant,p_request,'youtube_error_'||p_error);
  end if;
  perform private.music_track(tenant);
  return private.music_response(tenant);
end $$;

create function public.music_admin_skip(p_tenant uuid,p_request uuid) returns boolean
language plpgsql security definer set search_path='' as $$
begin
  perform private.music_admin_lock(p_tenant);
  update public.music_requests set status='skipped',skipped_at=clock_timestamp()
    where establishment_id=p_tenant and id=p_request and status='playing';
  if not found then return false; end if;
  update private.music_leases set current_request_id=null,playback_generation=playback_generation+1 where establishment_id=p_tenant;
  if private.music_live(p_tenant) and exists(select 1 from public.music_settings where establishment_id=p_tenant and music_enabled) then
    perform private.music_track(p_tenant); end if;
  perform private.music_instruction(p_tenant);
  return true;
end $$;

create function public.music_admin_remove(p_tenant uuid,p_request uuid) returns boolean
language plpgsql security definer set search_path='' as $$
begin
  perform private.music_admin_lock(p_tenant);
  update public.music_requests set status='cancelled',cancelled_at=clock_timestamp()
    where establishment_id=p_tenant and id=p_request and status='queued';
  if not found then return false; end if;
  perform private.music_instruction(p_tenant);
  return true;
end $$;

-- Grants listed explicitly: new functions otherwise default to PUBLIC execute.
revoke all on function private.music_admin_lock(uuid),private.music_rate_ok(text,text,integer,interval),
  private.music_charge(text,text),private.music_rate_lock(),private.music_instruction(uuid),
  private.music_track(uuid),private.music_response(uuid),private.music_live(uuid),
  private.music_validate_lease(text,text,uuid,bigint) from public,anon,authenticated,service_role;
revoke all on function public.music_availability(text),public.music_admin_settings(uuid,boolean,boolean),
  public.music_admin_revoke(uuid),public.music_admin_pair(uuid,boolean),public.music_admin_skip(uuid,uuid),
  public.music_admin_remove(uuid,uuid),public.music_redeem_pair(text,text,text,text),
  public.music_player_state(text,text,uuid,uuid),public.music_player_heartbeat(text,text,uuid,bigint,boolean),
  public.music_player_event(text,text,uuid,bigint,bigint,uuid,text,integer) from public,anon,authenticated,service_role;
grant execute on function public.music_availability(text) to anon,authenticated,service_role;
grant execute on function public.music_admin_settings(uuid,boolean,boolean),public.music_admin_revoke(uuid),
  public.music_admin_pair(uuid,boolean),public.music_admin_skip(uuid,uuid),public.music_admin_remove(uuid,uuid) to authenticated;
grant execute on function public.music_redeem_pair(text,text,text,text),public.music_player_state(text,text,uuid,uuid),
  public.music_player_heartbeat(text,text,uuid,bigint,boolean),public.music_player_event(text,text,uuid,bigint,bigint,uuid,text,integer) to service_role;
