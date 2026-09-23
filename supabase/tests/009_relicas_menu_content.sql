begin;

\ir ../content/relicas_menu.sql

do $$ begin
  if (select count(*) from public.products where establishment_id = '241460c5-accf-47c8-bf64-22e133edea2d' and id = md5('relicas-menu:' || category_id::text || ':' || name)::uuid) <> 91 then
    raise exception 'Expected 91 approved menu products';
  end if;
  if not exists (select 1 from public.products where category_id = 'c6f8e31c-6071-42b7-857a-c9ac38f869ed' and name = 'Batata Frita Completa' and description = 'Com cheddar e bacon' and price_cents = 3490) then raise exception 'Representative portion is incorrect'; end if;
  if not exists (select 1 from public.products where category_id = '6b50bf9c-d27a-49c8-b607-01b25cc4aa1a' and name = 'Heineken 600ml' and price_cents = 1990) then raise exception 'Representative beer is incorrect'; end if;
  if exists (select 1 from public.products p join public.categories c on c.id = p.category_id where p.id = md5('relicas-menu:' || p.category_id::text || ':' || p.name)::uuid and p.establishment_id <> c.establishment_id) then raise exception 'Imported product crossed tenant boundary'; end if;
end; $$;

\ir ../content/relicas_menu.sql

do $$ begin
  if (select count(*) from public.products where establishment_id = '241460c5-accf-47c8-bf64-22e133edea2d' and id = md5('relicas-menu:' || category_id::text || ':' || name)::uuid) <> 91 then raise exception 'Menu import is not idempotent'; end if;
end; $$;

rollback;
