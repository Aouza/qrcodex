-- POC-only playback terminal boundary. Browsers never receive service credentials.
revoke update on public.music_requests from authenticated;
drop policy music_requests_member_update on public.music_requests;

create or replace function public.claim_next_music_request(tenant_id uuid)
returns public.music_requests
language plpgsql security definer set search_path = '' as $$
declare
  result public.music_requests;
begin
  -- Serialize all playback operations, including the initially empty queue.
  perform 1 from public.establishments where id = tenant_id and active for update;
  if not found then return null; end if;
  select * into result from public.music_requests
    where establishment_id = tenant_id and status = 'playing';
  if result.id is not null then return result; end if;
  select * into result from public.music_requests
    where establishment_id = tenant_id and status = 'queued'
    order by requested_at, id limit 1 for update;
  if result.id is null then return null; end if;
  update public.music_requests set status = 'playing', playing_at = now()
    where id = result.id and establishment_id = tenant_id
    returning * into result;
  return result;
exception when unique_violation then
  select * into result from public.music_requests
    where establishment_id = tenant_id and status = 'playing';
  return result;
end;
$$;

create or replace function public.mark_music_request_played(tenant_id uuid, request_id uuid)
returns public.music_requests
language plpgsql security definer set search_path = '' as $$
declare result public.music_requests;
begin
  perform 1 from public.establishments where id = tenant_id and active for update;
  if not found then return null; end if;
  update public.music_requests set status = 'played', played_at = now()
    where establishment_id = tenant_id and id = request_id and status = 'playing'
    returning * into result;
  return result;
end;
$$;

create or replace function public.mark_music_request_failed(tenant_id uuid, request_id uuid, failure_reason text default null)
returns public.music_requests
language plpgsql security definer set search_path = '' as $$
declare result public.music_requests;
begin
  perform 1 from public.establishments where id = tenant_id and active for update;
  if not found then return null; end if;
  update public.music_requests set status = 'failed', failed_at = now(),
      failure_reason = left(nullif(btrim(coalesce(mark_music_request_failed.failure_reason, '')), ''), 160)
    where establishment_id = tenant_id and id = request_id and status = 'playing'
    returning * into result;
  return result;
end;
$$;

-- Validate a technical event and advance in one transaction. Stale events
-- return current authoritative state without marking any other request.
create function public.advance_music_player(tenant_id uuid, request_id uuid, playback_event text, error_code integer default null)
returns public.music_requests
language plpgsql security definer set search_path = '' as $$
declare result public.music_requests;
begin
  if playback_event not in ('ended', 'error') or playback_event is null then
    raise exception 'invalid_playback_event' using errcode = '22023';
  end if;
  if playback_event = 'error' and (error_code is null or error_code not in (2, 5, 100, 101, 150, 153)) then
    raise exception 'invalid_playback_error' using errcode = '22023';
  end if;
  perform 1 from public.establishments where id = tenant_id and active for update;
  if not found then return null; end if;
  select * into result from public.music_requests
    where establishment_id = tenant_id and status = 'playing';
  if result.id is distinct from request_id then return result; end if;
  if playback_event = 'ended' then
    perform public.mark_music_request_played(tenant_id, request_id);
  else
    perform public.mark_music_request_failed(tenant_id, request_id, 'youtube_error_' || error_code::text);
  end if;
  return public.claim_next_music_request(tenant_id);
end;
$$;

revoke all on function public.claim_next_music_request(uuid) from public, anon, authenticated;
revoke all on function public.mark_music_request_played(uuid, uuid) from public, anon, authenticated;
revoke all on function public.mark_music_request_failed(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.advance_music_player(uuid, uuid, text, integer) from public, anon, authenticated;
grant execute on function public.claim_next_music_request(uuid), public.mark_music_request_played(uuid, uuid),
  public.mark_music_request_failed(uuid, uuid, text), public.advance_music_player(uuid, uuid, text, integer) to service_role;

-- Opaque broadcast topics carry only a wake-up signal, never queue records.
-- No table SELECT or lifecycle privilege is needed by the TV's anon client.
create table private.music_player_topics (
  establishment_id uuid primary key references public.establishments(id) on delete cascade,
  topic uuid not null unique default gen_random_uuid()
);
alter table private.music_player_topics enable row level security;
revoke all on private.music_player_topics from public, anon, authenticated;

create function public.music_player_topic(tenant_id uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if not exists (select 1 from public.establishments where id = tenant_id and active) then return null; end if;
  insert into private.music_player_topics(establishment_id) values (tenant_id) on conflict do nothing;
  select topic into result from private.music_player_topics where establishment_id = tenant_id;
  return 'music-poc:' || result::text;
end;
$$;
revoke all on function public.music_player_topic(uuid) from public, anon, authenticated;
grant execute on function public.music_player_topic(uuid) to service_role;

create function private.notify_music_player() returns trigger
language plpgsql security definer set search_path = '' as $$
declare target text;
begin
  select 'music-poc:' || topic::text into target from private.music_player_topics
    where establishment_id = new.establishment_id;
  if target is not null then
    perform realtime.send('{}'::jsonb, 'wake', target, false);
  end if;
  return new;
end;
$$;
revoke all on function private.notify_music_player() from public, anon, authenticated;
create trigger music_requests_wake_player after insert on public.music_requests
  for each row when (new.status = 'queued') execute function private.notify_music_player();
