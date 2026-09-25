create table public.events (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id),
  title text not null check (btrim(title) <> ''),
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  image_url text,
  external_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_valid_time_range
    check (ends_at is null or ends_at >= starts_at),
  unique (id, establishment_id)
);

create index events_public_order_idx
  on public.events (establishment_id, active, starts_at, id);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

revoke all on public.events from public, anon, authenticated;
grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;

create policy events_public_read on public.events
  for select to anon
  using (
    active
    and exists (
      select 1
      from public.establishments e
      where e.id = events.establishment_id
        and e.active
    )
  );

create policy events_member_access on public.events
  for all to authenticated
  using (private.is_establishment_member(establishment_id))
  with check (private.is_establishment_member(establishment_id));
