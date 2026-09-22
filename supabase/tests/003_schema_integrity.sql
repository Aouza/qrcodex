begin;

do $$
declare
  establishment_a uuid := gen_random_uuid();
  establishment_b uuid := gen_random_uuid();
  category_a uuid := gen_random_uuid();
  category_b uuid := gen_random_uuid();
begin
  if (
    select count(*)
    from pg_class
    where oid in (
      'public.establishments'::regclass,
      'public.establishment_users'::regclass,
      'public.categories'::regclass,
      'public.products'::regclass
    ) and relrowsecurity
  ) <> 4 then
    raise exception 'RLS must be enabled on all four tables';
  end if;

  insert into public.establishments (id, name, slug)
  values
    (establishment_a, 'Schema test A', 'schema-test-a'),
    (establishment_b, 'Schema test B', 'schema-test-b');

  insert into public.categories (id, establishment_id, name, slug)
  values
    (category_a, establishment_a, 'Drinks', 'drinks'),
    (category_b, establishment_b, 'Drinks', 'drinks');

  insert into public.products (establishment_id, category_id, name, price_cents)
  values (establishment_a, category_a, 'Valid product', 1990);

  begin
    insert into public.products (establishment_id, category_id, name, price_cents)
    values (establishment_a, category_b, 'Cross-tenant product', 1990);
    raise exception 'Cross-tenant category reference was accepted';
  exception when foreign_key_violation then
    null;
  end;

  begin
    insert into public.products (establishment_id, category_id, name, price_cents)
    values (establishment_a, category_a, 'Negative price', -1);
    raise exception 'Negative price was accepted';
  exception when check_violation then
    null;
  end;

  begin
    insert into public.categories (establishment_id, name, slug)
    values (establishment_a, 'Duplicate drinks', 'drinks');
    raise exception 'Duplicate category slug was accepted';
  exception when unique_violation then
    null;
  end;

  begin
    insert into public.establishments (name, slug)
    values ('Duplicate establishment', 'schema-test-a');
    raise exception 'Duplicate establishment slug was accepted';
  exception when unique_violation then
    null;
  end;

  begin
    insert into public.categories (establishment_id, name, slug)
    values (gen_random_uuid(), 'Unknown establishment', 'unknown');
    raise exception 'Category with unknown establishment was accepted';
  exception when foreign_key_violation then
    null;
  end;

  begin
    insert into public.products (establishment_id, category_id, name, price_cents)
    values (gen_random_uuid(), category_a, 'Unknown establishment', 1990);
    raise exception 'Product with unknown establishment was accepted';
  exception when foreign_key_violation then
    null;
  end;
end;
$$;

rollback;
