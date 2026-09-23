begin;

do $$
declare
  tenant_a uuid := gen_random_uuid(); tenant_b uuid := gen_random_uuid(); user_a uuid := gen_random_uuid();
  category_a uuid := gen_random_uuid(); category_b uuid := gen_random_uuid();
begin
  perform set_config('app.test.tenant_a', tenant_a::text, true); perform set_config('app.test.tenant_b', tenant_b::text, true);
  perform set_config('app.test.user_a', user_a::text, true); perform set_config('app.test.category_a', category_a::text, true); perform set_config('app.test.category_b', category_b::text, true);
  insert into auth.users (id, aud, role, email) values (user_a, 'authenticated', 'authenticated', 'category-' || user_a || '@example.test');
  insert into public.establishments (id, name, slug) values (tenant_a, 'Category A', 'category-' || tenant_a), (tenant_b, 'Category B', 'category-' || tenant_b);
  insert into public.establishment_users (establishment_id, user_id) values (tenant_a, user_a);
  insert into public.categories (id, establishment_id, name, slug) values (category_a, tenant_a, 'A', 'a'), (category_b, tenant_b, 'B', 'b');
end;
$$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'categories' and column_name = 'image_url') then raise exception 'categories.image_url is missing'; end if;
  if not exists (select 1 from storage.buckets where id = 'category-images' and public and file_size_limit = 786432 and allowed_mime_types @> array['image/jpeg', 'image/png', 'image/webp']::text[]) then raise exception 'Category image bucket contract is incorrect'; end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'category_images_member_delete') then raise exception 'Category image delete policy is missing'; end if;
end; $$;

select set_config('request.jwt.claim.sub', current_setting('app.test.user_a'), true);
set local role authenticated;

do $$
declare
  own_path text := current_setting('app.test.tenant_a') || '/' || current_setting('app.test.category_a') || '/test.webp';
  foreign_path text := current_setting('app.test.tenant_b') || '/' || current_setting('app.test.category_b') || '/test.webp';
begin
  insert into storage.objects (bucket_id, name) values ('category-images', own_path);
  begin insert into storage.objects (bucket_id, name) values ('category-images', foreign_path); raise exception 'Cross-tenant category image insert was accepted';
  exception when insufficient_privilege then null; end;
  update storage.objects set metadata = '{"tested":true}'::jsonb where bucket_id = 'category-images' and name = own_path;
  if not found then raise exception 'Own category image update failed'; end if;
end;
$$;

rollback;
