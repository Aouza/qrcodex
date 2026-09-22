create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.is_establishment_member(tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.establishment_users eu
    where eu.establishment_id = tenant_id
      and eu.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_establishment_member(uuid) from public;
grant execute on function private.is_establishment_member(uuid) to authenticated;

revoke all on public.establishments, public.establishment_users,
  public.categories, public.products from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.establishments, public.categories, public.products to anon;
grant select, insert, update, delete on public.establishments,
  public.establishment_users, public.categories, public.products to authenticated;

create policy establishments_public_read on public.establishments
  for select to anon
  using (active);

create policy establishments_member_access on public.establishments
  for all to authenticated
  using (private.is_establishment_member(id))
  with check (private.is_establishment_member(id));

create policy establishment_users_member_access on public.establishment_users
  for all to authenticated
  using (private.is_establishment_member(establishment_id))
  with check (private.is_establishment_member(establishment_id));

create policy categories_public_read on public.categories
  for select to anon
  using (
    active
    and exists (
      select 1 from public.establishments e
      where e.id = categories.establishment_id and e.active
    )
  );

create policy categories_member_access on public.categories
  for all to authenticated
  using (private.is_establishment_member(establishment_id))
  with check (private.is_establishment_member(establishment_id));

create policy products_public_read on public.products
  for select to anon
  using (
    active
    and exists (
      select 1
      from public.categories c
      join public.establishments e on e.id = c.establishment_id
      where c.id = products.category_id
        and c.establishment_id = products.establishment_id
        and c.active
        and e.active
    )
  );

create policy products_member_access on public.products
  for all to authenticated
  using (private.is_establishment_member(establishment_id))
  with check (private.is_establishment_member(establishment_id));
