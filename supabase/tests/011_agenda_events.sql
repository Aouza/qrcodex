begin;

do $$
declare
  tenant_a uuid := gen_random_uuid();
  tenant_b uuid := gen_random_uuid();
  tenant_inactive uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid();
  user_b uuid := gen_random_uuid();
begin
  perform set_config('app.test.agenda_tenant_a', tenant_a::text, true);
  perform set_config('app.test.agenda_tenant_b', tenant_b::text, true);
  perform set_config('app.test.agenda_tenant_inactive', tenant_inactive::text, true);
  perform set_config('app.test.agenda_user_a', user_a::text, true);
  perform set_config('app.test.agenda_user_b', user_b::text, true);

  if not (
    select relrowsecurity
    from pg_class
    where oid = 'public.events'::regclass
  ) then
    raise exception 'RLS must be enabled on events';
  end if;

  insert into auth.users (id, aud, role, email)
  values
    (user_a, 'authenticated', 'authenticated', 'agenda-' || user_a || '@example.test'),
    (user_b, 'authenticated', 'authenticated', 'agenda-' || user_b || '@example.test');

  insert into public.establishments (id, name, slug, active)
  values
    (tenant_a, 'Agenda A', 'agenda-' || tenant_a, true),
    (tenant_b, 'Agenda B', 'agenda-' || tenant_b, true),
    (tenant_inactive, 'Agenda inactive', 'agenda-' || tenant_inactive, false);

  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_a), (tenant_b, user_b);

  insert into public.events (
    establishment_id, title, description, starts_at, ends_at, external_url, active
  )
  values
    (tenant_a, 'Visible A', 'Public event', '2026-10-01 22:00:00+00', '2026-10-02 01:00:00+00', 'https://example.test/event-a', true),
    (tenant_a, 'Inactive A', null, '2026-10-03 22:00:00+00', null, null, false),
    (tenant_b, 'Visible B', null, '2026-10-04 22:00:00+00', null, null, true),
    (tenant_inactive, 'Hidden establishment', null, '2026-10-05 22:00:00+00', null, null, true);

  begin
    insert into public.events (establishment_id, title, starts_at, ends_at)
    values (tenant_a, 'Invalid range', '2026-10-02 01:00:00+00', '2026-10-01 22:00:00+00');
    raise exception 'Event with an invalid time range was accepted';
  exception when check_violation then
    null;
  end;

  begin
    insert into public.events (establishment_id, title, starts_at)
    values (tenant_a, '   ', '2026-10-01 22:00:00+00');
    raise exception 'Blank event title was accepted';
  exception when check_violation then
    null;
  end;
end;
$$;

set local role anon;

do $$
begin
  if (select count(*) from public.events
      where establishment_id = current_setting('app.test.agenda_tenant_a')::uuid) <> 1
     or (select count(*) from public.events
      where establishment_id = current_setting('app.test.agenda_tenant_b')::uuid) <> 1
     or (select count(*) from public.events
      where establishment_id = current_setting('app.test.agenda_tenant_inactive')::uuid) <> 0 then
    raise exception 'Anonymous event visibility is incorrect';
  end if;

  begin
    insert into public.events (establishment_id, title, starts_at)
    values (
      current_setting('app.test.agenda_tenant_a')::uuid,
      'Anonymous write',
      '2026-10-06 22:00:00+00'
    );
    raise exception 'Anonymous event insert was accepted';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('app.test.agenda_user_a'), true);
set local role authenticated;

do $$
declare
  tenant_a uuid := current_setting('app.test.agenda_tenant_a')::uuid;
  tenant_b uuid := current_setting('app.test.agenda_tenant_b')::uuid;
begin
  if (select count(*) from public.events where establishment_id = tenant_a) <> 2
     or (select count(*) from public.events where establishment_id = tenant_b) <> 0 then
    raise exception 'Authenticated event reads are not tenant scoped';
  end if;

  insert into public.events (establishment_id, title, starts_at)
  values (tenant_a, 'Own event', '2026-10-06 22:00:00+00');

  begin
    insert into public.events (establishment_id, title, starts_at)
    values (tenant_b, 'Cross-tenant event', '2026-10-07 22:00:00+00');
    raise exception 'Cross-tenant event insert was accepted';
  exception when insufficient_privilege then
    null;
  end;

  update public.events
  set title = 'Own event updated'
  where establishment_id = tenant_a and title = 'Own event';
  if not found then
    raise exception 'Own event update failed';
  end if;

  update public.events
  set title = 'Cross-tenant update'
  where establishment_id = tenant_b;
  if found then
    raise exception 'Cross-tenant event update was accepted';
  end if;

  delete from public.events where establishment_id = tenant_b;
  if found then
    raise exception 'Cross-tenant event delete was accepted';
  end if;

  delete from public.events
  where establishment_id = tenant_a and title = 'Own event updated';
  if not found then
    raise exception 'Own event delete failed';
  end if;
end;
$$;

rollback;
