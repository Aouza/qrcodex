create table public.music_requests (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id),
  youtube_video_id text not null check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null check (btrim(title) <> ''),
  channel_title text not null check (btrim(channel_title) <> ''),
  thumbnail_url text,
  status text not null default 'queued'
    check (status in ('queued', 'playing', 'played', 'failed')),
  requested_at timestamptz not null default now(),
  playing_at timestamptz,
  played_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint music_requests_status_timestamps
    check (
      (status = 'queued' and playing_at is null and played_at is null and failed_at is null)
      or (status = 'playing' and playing_at is not null and played_at is null and failed_at is null)
      or (status = 'played' and playing_at is not null and played_at is not null and failed_at is null)
      or (status = 'failed' and playing_at is not null and played_at is null and failed_at is not null)
    )
);

create index music_requests_queue_idx
  on public.music_requests (establishment_id, status, requested_at, id);

create index music_requests_playing_idx
  on public.music_requests (establishment_id, status, playing_at);

create unique index music_requests_one_playing_per_establishment_idx
  on public.music_requests (establishment_id)
  where status = 'playing';

create trigger music_requests_set_updated_at
  before update on public.music_requests
  for each row execute function public.set_updated_at();

alter table public.music_requests enable row level security;

revoke all on public.music_requests from public, anon, authenticated;
grant select, update on public.music_requests to authenticated;

create policy music_requests_member_read on public.music_requests
  for select to authenticated
  using (private.is_establishment_member(establishment_id));

create policy music_requests_member_update on public.music_requests
  for update to authenticated
  using (private.is_establishment_member(establishment_id))
  with check (private.is_establishment_member(establishment_id));

create or replace function public.create_music_request(
  tenant_slug text,
  video_id text,
  title text,
  channel_title text,
  thumbnail_url text default null
)
returns public.music_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  tenant_id uuid;
  inserted_request public.music_requests;
begin
  select e.id
  into tenant_id
  from public.establishments e
  where e.slug = tenant_slug
    and e.active
  limit 1;

  if tenant_id is null then
    return null;
  end if;

  if video_id is null or video_id !~ '^[A-Za-z0-9_-]{11}$' then
    raise exception 'invalid_video_id' using errcode = '22023';
  end if;

  if title is null or btrim(title) = '' then
    raise exception 'invalid_title' using errcode = '22023';
  end if;

  if channel_title is null or btrim(channel_title) = '' then
    raise exception 'invalid_channel_title' using errcode = '22023';
  end if;

  insert into public.music_requests (
    establishment_id,
    youtube_video_id,
    title,
    channel_title,
    thumbnail_url,
    status
  )
  values (
    tenant_id,
    video_id,
    btrim(title),
    btrim(channel_title),
    nullif(btrim(coalesce(thumbnail_url, '')), ''),
    'queued'
  )
  returning * into inserted_request;

  return inserted_request;
end;
$$;

revoke all on function public.create_music_request(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.create_music_request(text, text, text, text, text) to anon, authenticated;

create or replace function public.claim_next_music_request(tenant_id uuid)
returns public.music_requests
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_request public.music_requests;
  next_request public.music_requests;
begin
  if not private.is_establishment_member(tenant_id) then
    return null;
  end if;

  select mr.*
  into current_request
  from public.music_requests mr
  where mr.establishment_id = tenant_id
    and mr.status = 'playing'
  order by mr.playing_at, mr.id
  limit 1
  for update;

  if current_request.id is not null then
    return current_request;
  end if;

  select mr.*
  into next_request
  from public.music_requests mr
  where mr.establishment_id = tenant_id
    and mr.status = 'queued'
  order by mr.requested_at, mr.id
  limit 1
  for update skip locked;

  if next_request.id is null then
    return null;
  end if;

  update public.music_requests
  set status = 'playing',
      playing_at = now()
  where id = next_request.id
    and establishment_id = tenant_id
    and status = 'queued'
  returning * into next_request;

  return next_request;
exception
  when unique_violation then
    select mr.*
    into current_request
    from public.music_requests mr
    where mr.establishment_id = tenant_id
      and mr.status = 'playing'
    order by mr.playing_at, mr.id
    limit 1;

    return current_request;
end;
$$;

revoke all on function public.claim_next_music_request(uuid) from public, anon;
grant execute on function public.claim_next_music_request(uuid) to authenticated;

create or replace function public.mark_music_request_played(tenant_id uuid, request_id uuid)
returns public.music_requests
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_request public.music_requests;
begin
  if not private.is_establishment_member(tenant_id) then
    return null;
  end if;

  update public.music_requests
  set status = 'played',
      played_at = now()
  where id = request_id
    and establishment_id = tenant_id
    and status = 'playing'
  returning * into updated_request;

  return updated_request;
end;
$$;

revoke all on function public.mark_music_request_played(uuid, uuid) from public, anon;
grant execute on function public.mark_music_request_played(uuid, uuid) to authenticated;

create or replace function public.mark_music_request_failed(
  tenant_id uuid,
  request_id uuid,
  failure_reason text default null
)
returns public.music_requests
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_request public.music_requests;
begin
  if not private.is_establishment_member(tenant_id) then
    return null;
  end if;

  update public.music_requests
  set status = 'failed',
      failed_at = now(),
      failure_reason = left(nullif(btrim(coalesce(failure_reason, '')), ''), 160)
  where id = request_id
    and establishment_id = tenant_id
    and status = 'playing'
  returning * into updated_request;

  return updated_request;
end;
$$;

revoke all on function public.mark_music_request_failed(uuid, uuid, text) from public, anon;
grant execute on function public.mark_music_request_failed(uuid, uuid, text) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.music_requests;
  end if;
exception
  when duplicate_object then
    null;
end;
$$;
