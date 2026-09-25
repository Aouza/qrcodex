begin;

do $$
declare
  tenant_a uuid := gen_random_uuid();
  tenant_b uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid();
  event_a uuid := gen_random_uuid();
  event_b uuid := gen_random_uuid();
begin
  perform set_config('app.test.event_image_tenant_a', tenant_a::text, true);
  perform set_config('app.test.event_image_tenant_b', tenant_b::text, true);
  perform set_config('app.test.event_image_user_a', user_a::text, true);
  perform set_config('app.test.event_image_event_a', event_a::text, true);
  perform set_config('app.test.event_image_event_b', event_b::text, true);

  insert into auth.users (id, aud, role, email)
  values (user_a, 'authenticated', 'authenticated', 'event-image-' || user_a || '@example.test');

  insert into public.establishments (id, name, slug)
  values
    (tenant_a, 'Event image A', 'event-image-' || tenant_a),
    (tenant_b, 'Event image B', 'event-image-' || tenant_b);

  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_a);

  insert into public.events (id, establishment_id, title, starts_at)
  values
    (event_a, tenant_a, 'Draft A', '2026-10-01 22:00:00+00'),
    (event_b, tenant_b, 'Draft B', '2026-10-02 22:00:00+00');

  if exists (select 1 from public.events where id = event_a and active) then
    raise exception 'Events without an explicit active value must default to draft';
  end if;

  begin
    update public.events set active = true where id = event_a;
    raise exception 'Event without an image was published';
  exception when check_violation then
    null;
  end;

  update public.events
  set image_url = 'https://project.test/storage/v1/object/public/event-images/' || tenant_a || '/' || event_a || '/flyer.webp',
      active = true
  where id = event_a;

  if not exists (select 1 from public.events where id = event_a and active) then
    raise exception 'Event with an image could not be published';
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from storage.buckets
    where id = 'event-images'
      and public
      and file_size_limit = 786432
      and allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
  ) then
    raise exception 'Event image bucket contract is incorrect';
  end if;

  if (
    select count(*)
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname in (
        'event_images_member_insert',
        'event_images_member_select',
        'event_images_member_update',
        'event_images_member_delete'
      )
  ) <> 4 then
    raise exception 'Event image Storage policies are incomplete';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', current_setting('app.test.event_image_user_a'), true);
set local role authenticated;

do $$
declare
  own_path text := current_setting('app.test.event_image_tenant_a') || '/'
    || current_setting('app.test.event_image_event_a') || '/flyer.webp';
  foreign_path text := current_setting('app.test.event_image_tenant_b') || '/'
    || current_setting('app.test.event_image_event_b') || '/flyer.webp';
  malformed_path text := current_setting('app.test.event_image_tenant_a') || '/flyer.webp';
begin
  insert into storage.objects (bucket_id, name)
  values ('event-images', own_path);

  begin
    insert into storage.objects (bucket_id, name)
    values ('event-images', foreign_path);
    raise exception 'Cross-tenant event image insert was accepted';
  exception when insufficient_privilege then
    null;
  end;

  begin
    insert into storage.objects (bucket_id, name)
    values ('event-images', malformed_path);
    raise exception 'Malformed event image path was accepted';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

rollback;
