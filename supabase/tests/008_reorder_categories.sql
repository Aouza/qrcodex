begin;

do $$
declare tenant_a uuid := gen_random_uuid(); tenant_b uuid := gen_random_uuid(); user_a uuid := gen_random_uuid();
  a1 uuid := gen_random_uuid(); a2 uuid := gen_random_uuid(); a3 uuid := gen_random_uuid(); b1 uuid := gen_random_uuid();
begin
  perform set_config('app.test.tenant_a', tenant_a::text, true); perform set_config('app.test.tenant_b', tenant_b::text, true);
  perform set_config('app.test.user_a', user_a::text, true); perform set_config('app.test.a1', a1::text, true); perform set_config('app.test.a2', a2::text, true); perform set_config('app.test.a3', a3::text, true); perform set_config('app.test.b1', b1::text, true);
  insert into auth.users (id, aud, role, email) values (user_a, 'authenticated', 'authenticated', 'order-' || user_a || '@example.test');
  insert into public.establishments (id, name, slug) values (tenant_a, 'Order A', 'order-' || tenant_a), (tenant_b, 'Order B', 'order-' || tenant_b);
  insert into public.establishment_users (establishment_id, user_id) values (tenant_a, user_a);
  insert into public.categories (id, establishment_id, name, slug, position) values
    (a1, tenant_a, 'A1', 'a1', 10), (a2, tenant_a, 'A2', 'a2', 20), (a3, tenant_a, 'A3', 'a3', 30), (b1, tenant_b, 'B1', 'b1', 0);
end; $$;

select set_config('request.jwt.claim.sub', current_setting('app.test.user_a'), true);
set local role authenticated;

do $$ begin
  if not public.reorder_category(current_setting('app.test.tenant_a')::uuid, current_setting('app.test.a2')::uuid, -1) then raise exception 'Owned category reorder failed'; end if;
  if public.reorder_category(current_setting('app.test.tenant_b')::uuid, current_setting('app.test.b1')::uuid, 1) then raise exception 'Cross-tenant category reorder succeeded'; end if;
  if (select array_agg(id order by position) from public.categories where establishment_id = current_setting('app.test.tenant_a')::uuid) <> array[current_setting('app.test.a2')::uuid, current_setting('app.test.a1')::uuid, current_setting('app.test.a3')::uuid] then raise exception 'Category order is incorrect'; end if;
  if (select array_agg(position order by position) from public.categories where establishment_id = current_setting('app.test.tenant_a')::uuid) <> array[0,1,2] then raise exception 'Category positions are not contiguous'; end if;
end; $$;

rollback;
