begin;

do $$
declare
  tenant_a uuid := gen_random_uuid();
  tenant_b uuid := gen_random_uuid();
  tenant_inactive uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid();
  user_b uuid := gen_random_uuid();
  user_c uuid := gen_random_uuid();
  category_a uuid := gen_random_uuid();
  category_a_inactive uuid := gen_random_uuid();
  category_b uuid := gen_random_uuid();
  category_inactive_tenant uuid := gen_random_uuid();
begin
  perform set_config('app.test.tenant_a', tenant_a::text, true);
  perform set_config('app.test.tenant_b', tenant_b::text, true);
  perform set_config('app.test.tenant_inactive', tenant_inactive::text, true);
  perform set_config('app.test.user_a', user_a::text, true);
  perform set_config('app.test.user_b', user_b::text, true);
  perform set_config('app.test.user_c', user_c::text, true);
  perform set_config('app.test.category_a', category_a::text, true);
  perform set_config('app.test.category_b', category_b::text, true);

  insert into auth.users (id, aud, role, email)
  values
    (user_a, 'authenticated', 'authenticated', 'rls-' || user_a || '@example.test'),
    (user_b, 'authenticated', 'authenticated', 'rls-' || user_b || '@example.test'),
    (user_c, 'authenticated', 'authenticated', 'rls-' || user_c || '@example.test');

  insert into public.establishments (id, name, slug, active)
  values
    (tenant_a, 'RLS A', 'rls-' || tenant_a, true),
    (tenant_b, 'RLS B', 'rls-' || tenant_b, true),
    (tenant_inactive, 'RLS inactive', 'rls-' || tenant_inactive, false);

  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_a), (tenant_b, user_b);

  insert into public.categories (id, establishment_id, name, slug, active)
  values
    (category_a, tenant_a, 'Visible A', 'visible', true),
    (category_a_inactive, tenant_a, 'Hidden A', 'hidden', false),
    (category_b, tenant_b, 'Visible B', 'visible', true),
    (category_inactive_tenant, tenant_inactive, 'Hidden tenant', 'visible', true);

  insert into public.products (establishment_id, category_id, name, price_cents, active, available)
  values
    (tenant_a, category_a, 'Available A', 100, true, true),
    (tenant_a, category_a, 'Unavailable A', 100, true, false),
    (tenant_a, category_a, 'Inactive A', 100, false, true),
    (tenant_a, category_a_inactive, 'Hidden category A', 100, true, true),
    (tenant_b, category_b, 'Available B', 100, true, true),
    (tenant_inactive, category_inactive_tenant, 'Hidden tenant', 100, true, true);
end;
$$;

set local role anon;

do $$
begin
  if (select count(*) from public.establishments
      where id in (current_setting('app.test.tenant_a')::uuid,
                   current_setting('app.test.tenant_b')::uuid,
                   current_setting('app.test.tenant_inactive')::uuid)) <> 2 then
    raise exception 'Anonymous establishment visibility is incorrect';
  end if;
  if (select count(*) from public.categories
      where establishment_id in (current_setting('app.test.tenant_a')::uuid,
                                 current_setting('app.test.tenant_b')::uuid,
                                 current_setting('app.test.tenant_inactive')::uuid)) <> 2 then
    raise exception 'Anonymous category visibility is incorrect';
  end if;
  if (select count(*) from public.products
      where establishment_id = current_setting('app.test.tenant_a')::uuid) <> 2
     or (select count(*) from public.products
      where establishment_id = current_setting('app.test.tenant_b')::uuid) <> 1
     or (select count(*) from public.products
      where establishment_id = current_setting('app.test.tenant_inactive')::uuid) <> 0
     or (select count(*) from public.products
      where establishment_id = current_setting('app.test.tenant_a')::uuid
        and not available) <> 1 then
    raise exception 'Anonymous product visibility is incorrect';
  end if;
  if has_table_privilege('anon', 'public.establishment_users', 'SELECT') then
    raise exception 'Anonymous membership reads are granted';
  end if;
  begin
    insert into public.establishments (name, slug) values ('Denied', 'rls-denied');
    raise exception 'Anonymous insert was accepted';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('app.test.user_a'), true);
set local role authenticated;

do $$
declare
  tenant_a uuid := current_setting('app.test.tenant_a')::uuid;
  tenant_b uuid := current_setting('app.test.tenant_b')::uuid;
  user_a uuid := current_setting('app.test.user_a')::uuid;
  user_c uuid := current_setting('app.test.user_c')::uuid;
  category_a uuid := current_setting('app.test.category_a')::uuid;
  category_b uuid := current_setting('app.test.category_b')::uuid;
begin
  if auth.uid() is distinct from user_a then
    raise exception 'Test JWT subject did not resolve';
  end if;
  if (select count(*) from public.establishments where id = tenant_a) <> 1
     or (select count(*) from public.establishments where id = tenant_b) <> 0
     or (select count(*) from public.establishment_users where establishment_id = tenant_a) <> 1
     or (select count(*) from public.establishment_users where establishment_id = tenant_b) <> 0
     or (select count(*) from public.categories where establishment_id = tenant_a) <> 2
     or (select count(*) from public.categories where establishment_id = tenant_b) <> 0
     or (select count(*) from public.products where establishment_id = tenant_a) <> 4
     or (select count(*) from public.products where establishment_id = tenant_b) <> 0 then
    raise exception 'Authenticated tenant reads are incorrect';
  end if;

  insert into public.products (establishment_id, category_id, name, price_cents)
  values (tenant_a, category_a, 'Own insert', 100);
  if (select count(*) from public.products where name = 'Own insert') <> 1 then
    raise exception 'Own product insert failed';
  end if;
  begin
    insert into public.establishments (id, name, slug)
    values (gen_random_uuid(), 'Cross-tenant establishment', 'rls-cross-establishment');
    raise exception 'Unlinked establishment insert was accepted';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.products (establishment_id, category_id, name, price_cents)
    values (tenant_b, category_b, 'Cross-tenant insert', 100);
    raise exception 'Cross-tenant product insert was accepted';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.categories (establishment_id, name, slug)
    values (tenant_b, 'Cross-tenant category', 'cross-tenant');
    raise exception 'Cross-tenant category insert was accepted';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.establishment_users (establishment_id, user_id)
    values (tenant_b, user_a);
    raise exception 'Cross-tenant membership insert was accepted';
  exception when insufficient_privilege then
    null;
  end;

  insert into public.establishment_users (establishment_id, user_id)
  values (tenant_a, user_c);
  if (select count(*) from public.establishment_users where establishment_id = tenant_a) <> 2 then
    raise exception 'Own membership insert failed';
  end if;

  update public.establishments set name = 'RLS A updated' where id = tenant_a;
  if not found then
    raise exception 'Own establishment update failed';
  end if;
  update public.categories set name = 'Visible A updated' where id = category_a;
  if not found then
    raise exception 'Own category update failed';
  end if;
  begin
    update public.establishment_users set establishment_id = tenant_b
    where establishment_id = tenant_a and user_id = user_c;
    raise exception 'Cross-tenant membership update was accepted';
  exception when insufficient_privilege then
    null;
  end;

  update public.products set available = false where name = 'Available A';
  if not exists (select 1 from public.products where name = 'Available A' and not available) then
    raise exception 'Own product update failed';
  end if;
  update public.products set name = 'Cross-tenant update' where establishment_id = tenant_b;
  if found then
    raise exception 'Cross-tenant product update was accepted';
  end if;
  delete from public.products where establishment_id = tenant_b;
  if found then
    raise exception 'Cross-tenant product delete was accepted';
  end if;
  update public.establishments set name = 'Cross-tenant update' where id = tenant_b;
  if found then
    raise exception 'Cross-tenant establishment update was accepted';
  end if;
  update public.categories set name = 'Cross-tenant update' where id = category_b;
  if found then
    raise exception 'Cross-tenant category update was accepted';
  end if;
  delete from public.categories where id = category_b;
  if found then
    raise exception 'Cross-tenant category delete was accepted';
  end if;
  delete from public.establishment_users where establishment_id = tenant_b;
  if found then
    raise exception 'Cross-tenant membership delete was accepted';
  end if;
  delete from public.products where name = 'Own insert';
  if not found then
    raise exception 'Own product delete failed';
  end if;
  delete from public.establishment_users
  where establishment_id = tenant_a and user_id = user_c;
  if not found then
    raise exception 'Own membership delete failed';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('app.test.user_b'), true);
set local role authenticated;

do $$
begin
  if (select count(*) from public.establishments
      where id = current_setting('app.test.tenant_b')::uuid) <> 1
     or (select count(*) from public.establishments
      where id = current_setting('app.test.tenant_a')::uuid) <> 0 then
    raise exception 'Second user tenant isolation failed';
  end if;
end;
$$;

rollback;
