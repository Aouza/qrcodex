begin;

do $$
declare
  tenant_a uuid := gen_random_uuid();
  tenant_b uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid();
  category_a uuid := gen_random_uuid();
  category_b uuid := gen_random_uuid();
  product_a uuid := gen_random_uuid();
  product_b uuid := gen_random_uuid();
begin
  perform set_config('app.test.tenant_a', tenant_a::text, true);
  perform set_config('app.test.tenant_b', tenant_b::text, true);
  perform set_config('app.test.user_a', user_a::text, true);
  perform set_config('app.test.product_a', product_a::text, true);
  perform set_config('app.test.product_b', product_b::text, true);

  insert into auth.users (id, aud, role, email)
  values (user_a, 'authenticated', 'authenticated', 'storage-' || user_a || '@example.test');
  insert into public.establishments (id, name, slug)
  values (tenant_a, 'Storage A', 'storage-' || tenant_a),
         (tenant_b, 'Storage B', 'storage-' || tenant_b);
  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_a);
  insert into public.categories (id, establishment_id, name, slug)
  values (category_a, tenant_a, 'A', 'a'),
         (category_b, tenant_b, 'B', 'b');
  insert into public.products (id, establishment_id, category_id, name, price_cents)
  values (product_a, tenant_a, category_a, 'A', 100),
         (product_b, tenant_b, category_b, 'B', 100);
end;
$$;

do $$
begin
  if not exists (
    select 1 from storage.buckets
    where id = 'product-images'
      and public
      and file_size_limit = 786432
      and allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]
  ) then
    raise exception 'Product image bucket contract is incorrect';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'product_images_member_delete'
      and roles = array['authenticated']::name[]
  ) then
    raise exception 'Product image delete policy is missing';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', current_setting('app.test.user_a'), true);
set local role authenticated;

do $$
declare
  own_path text := current_setting('app.test.tenant_a') || '/' || current_setting('app.test.product_a') || '/test.webp';
  foreign_path text := current_setting('app.test.tenant_b') || '/' || current_setting('app.test.product_b') || '/test.webp';
begin
  insert into storage.objects (bucket_id, name)
  values ('product-images', own_path);

  begin
    insert into storage.objects (bucket_id, name)
    values ('product-images', foreign_path);
    raise exception 'Cross-tenant storage insert was accepted';
  exception when insufficient_privilege then
    null;
  end;

  update storage.objects set metadata = '{"tested":true}'::jsonb
  where bucket_id = 'product-images' and name = own_path;
  if not found then
    raise exception 'Own storage update failed';
  end if;

end;
$$;

rollback;
