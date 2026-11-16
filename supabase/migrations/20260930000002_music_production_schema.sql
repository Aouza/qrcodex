-- Additive production boundary. Deploy only with TASK-055: legacy POC callers
-- intentionally lose execution rights. No requests/history are dropped here.
alter table public.music_requests
  add column skipped_at timestamptz,
  add column cancelled_at timestamptz,
  add column metadata_verified_at timestamptz not null default now();
alter table public.music_requests drop constraint music_requests_status_check;
alter table public.music_requests drop constraint music_requests_status_timestamps;
alter table public.music_requests add constraint music_requests_status_check
  check (status in ('queued','playing','played','failed','skipped','cancelled'));
alter table public.music_requests add constraint music_requests_status_timestamps check (
  (status='queued' and playing_at is null and played_at is null and failed_at is null and skipped_at is null and cancelled_at is null) or
  (status='playing' and playing_at is not null and played_at is null and failed_at is null and skipped_at is null and cancelled_at is null) or
  (status='played' and playing_at is not null and played_at is not null and failed_at is null and skipped_at is null and cancelled_at is null) or
  (status='failed' and playing_at is not null and played_at is null and failed_at is not null and skipped_at is null and cancelled_at is null) or
  (status='skipped' and playing_at is not null and played_at is null and failed_at is null and skipped_at is not null and cancelled_at is null) or
  (status='cancelled' and playing_at is null and played_at is null and failed_at is null and skipped_at is null and cancelled_at is not null)
);
-- Pre-existing metadata must not get a fresh 30-day validity just from migration.
update public.music_requests set metadata_verified_at=requested_at;
alter table public.music_requests add constraint music_requests_id_tenant_unique unique(id,establishment_id);

create table public.music_settings (
  establishment_id uuid primary key references public.establishments(id) on delete cascade,
  music_enabled boolean not null default false,
  requests_enabled boolean not null default false,
  queue_limit integer not null default 30 check (queue_limit between 1 and 100),
  updated_at timestamptz not null default now()
);
insert into public.music_settings(establishment_id) select id from public.establishments;
alter table public.music_settings enable row level security;
revoke all on public.music_settings from public,anon,authenticated;
grant select on public.music_settings to authenticated;
create policy music_settings_member_read on public.music_settings for select to authenticated
  using (private.is_establishment_member(establishment_id));

create table private.music_pairings (
  code_hash text primary key check (code_hash ~ '^[a-f0-9]{64}$'),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create table private.music_devices (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '30 days',
  revoked_at timestamptz,
  unique(establishment_id,token_hash)
);
create unique index music_one_device on private.music_devices(establishment_id) where revoked_at is null;
create table private.music_leases (
  establishment_id uuid primary key references public.establishments(id) on delete cascade,
  token_hash text,
  instance_id uuid,
  boot_id uuid,
  lease_generation bigint not null default 0,
  playback_generation bigint not null default 0,
  expires_at timestamptz not null default '-infinity',
  ready boolean not null default false,
  current_request_id uuid,
  foreign key(current_request_id,establishment_id) references public.music_requests(id,establishment_id)
    on delete set null(current_request_id),
  foreign key(establishment_id,token_hash) references private.music_devices(establishment_id,token_hash)
);
create table private.music_rate_events (
  id bigint generated always as identity primary key,
  scope text not null,
  actor text not null,
  occurred_at timestamptz not null default clock_timestamp()
);
create index music_rate_lookup on private.music_rate_events(scope,actor,occurred_at);
create table private.music_limit_config (
  scope text not null,
  window_size interval not null check(window_size>interval '0 seconds' and window_size<=interval '24 hours'),
  maximum integer not null check(maximum between 1 and 100000),
  primary key(scope,window_size)
);
insert into private.music_limit_config(scope,window_size,maximum) values
 ('request-visitor','60 seconds',1),('request-visitor','1 hour',5),('request-network','1 minute',60),
 ('api-search','1 minute',5),('api-validate','1 minute',5),('api-network','1 minute',60),
 ('pair-network','10 minutes',5),('pair-tenant','10 minutes',50),('pair-global','10 minutes',500),
 ('pair-issue','1 hour',10),('pair-issue-global','1 hour',1000);
create table private.music_receipts (
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  visitor_hash text not null check (visitor_hash ~ '^[a-f0-9]{64}$'),
  retry_id uuid not null,
  video_id text not null,
  request_id uuid not null,
  created_at timestamptz not null default now(),
  primary key(establishment_id,visitor_hash,retry_id),
  foreign key(request_id,establishment_id) references public.music_requests(id,establishment_id) on delete cascade
);
create table private.music_quota (
  bucket text primary key check(bucket in ('search','video')),
  daily_budget integer not null default 0 check (daily_budget between 0 and 10000000),
  quota_day date,
  used_units integer not null default 0 check (used_units>=0)
);
insert into private.music_quota(bucket) values('search'),('video');

alter table private.music_pairings enable row level security;
alter table private.music_devices enable row level security;
alter table private.music_leases enable row level security;
alter table private.music_rate_events enable row level security;
alter table private.music_limit_config enable row level security;
alter table private.music_receipts enable row level security;
alter table private.music_quota enable row level security;
revoke all on private.music_pairings,private.music_devices,private.music_leases,
  private.music_rate_events,private.music_limit_config,private.music_receipts,private.music_quota from public,anon,authenticated,service_role;
revoke all on sequence private.music_rate_events_id_seq from public,anon,authenticated,service_role;
revoke insert,update,delete on public.music_requests,public.music_settings from service_role;
-- Quota budget is set only by a reviewed trusted DB operation, not a player/admin RPC.
revoke all on function public.create_music_request(text,text,text,text,text) from public,anon,authenticated,service_role;
revoke all on function public.claim_next_music_request(uuid),public.mark_music_request_played(uuid,uuid),
  public.mark_music_request_failed(uuid,uuid,text),public.advance_music_player(uuid,uuid,text,integer),
  public.music_player_topic(uuid) from public,anon,authenticated,service_role;
