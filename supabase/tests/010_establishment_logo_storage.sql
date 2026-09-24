begin;

do $$
declare
  tenant_a uuid := gen_random_uuid();
  tenant_b uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid();
begin
  perform set_config('app.test.tenant_a', tenant_a::text, true);
  perform set_config('app.test.tenant_b', tenant_b::text, true);
  perform set_config('app.test.user_a', user_a::text, true);
  insert into auth.users (id, aud, role, email)
  values (user_a, 'authenticated', 'authenticated', 'logo-' || user_a || '@example.test');
  insert into public.establishments (id, name, slug)
  values
    (tenant_a, 'Logo A', 'logo-' || tenant_a),
    (tenant_b, 'Logo B', 'logo-' || tenant_b);
  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_a);
end;
$$;

do $$
begin
  if not exists (
    select 1 from storage.buckets
    where id = 'establishment-images'
      and public
      and file_size_limit = 786432
      and allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
  ) then
    raise exception 'Establishment image bucket contract is incorrect';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'establishment_images_member_delete'
  ) then
    raise exception 'Establishment image delete policy is missing';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', current_setting('app.test.user_a'), true);
set local role authenticated;

do $$
declare
  own_path text := current_setting('app.test.tenant_a') || '/logo/test.webp';
  foreign_path text := current_setting('app.test.tenant_b') || '/logo/test.webp';
  malformed_path text := current_setting('app.test.tenant_a') || '/other/test.webp';
begin
  insert into storage.objects (bucket_id, name) values ('establishment-images', own_path);
  begin
    insert into storage.objects (bucket_id, name) values ('establishment-images', foreign_path);
    raise exception 'Cross-tenant establishment logo insert was accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into storage.objects (bucket_id, name) values ('establishment-images', malformed_path);
    raise exception 'Malformed establishment logo path was accepted';
  exception when insufficient_privilege then null;
  end;
end;
$$;

rollback;
