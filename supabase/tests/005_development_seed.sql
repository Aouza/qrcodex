begin;

\ir ../seed.sql

do $$
declare
  tenant_id uuid := '241460c5-accf-47c8-bf64-22e133edea2d';
begin
  if (select count(*) from public.establishments where id = tenant_id
      and name = 'Relica''s Rock & Bar' and slug = 'relicas') <> 1 then
    raise exception 'Relica establishment seed is incorrect';
  end if;
  if (select count(*) from public.categories where establishment_id = tenant_id) <> 9 then
    raise exception 'Expected exactly nine Relica categories';
  end if;
  if exists (
    select 1
    from (values
      ('c6f8e31c-6071-42b7-857a-c9ac38f869ed'::uuid, 'Porções', 'porcoes', 0),
      ('da7d13d1-2dfe-42b7-af93-9e4992222a75'::uuid, 'Lanches', 'lanches', 1),
      ('c1b24d24-2bf6-495d-8d86-6b447208ee62'::uuid, 'Bebidas', 'bebidas', 2),
      ('653be2e7-ea07-4802-adbb-c46cc8656d71'::uuid, 'Drinks e Doses', 'drinks-e-doses', 3),
      ('2f756bb8-53dc-4bf0-aeb3-868682d28a15'::uuid, 'Cachaças', 'cachacas', 4),
      ('6b50bf9c-d27a-49c8-b607-01b25cc4aa1a'::uuid, 'Cervejas', 'cervejas', 5),
      ('a4d5a30b-20a1-4ea8-9dc7-00a977e5164f'::uuid, 'Caipirinhas', 'caipirinhas', 6),
      ('bbce2238-f253-45f4-bca5-3e5254362b93'::uuid, 'Vinhos', 'vinhos', 7),
      ('f194c3ba-0386-4231-b3fd-fb8e3f0c2323'::uuid, 'Whiskies', 'whiskies', 8)
    ) expected(id, name, slug, position)
    left join public.categories c on c.id = expected.id
    where c.id is null
      or c.establishment_id <> tenant_id
      or c.name <> expected.name
      or c.slug <> expected.slug
      or c.position <> expected.position
  ) then
    raise exception 'Relica category labels, tenant or order are incorrect';
  end if;
end;
$$;

update public.categories
set name = 'Bebidas personalizadas', slug = 'bebidas-personalizadas', position = 20, active = false
where id = 'c1b24d24-2bf6-495d-8d86-6b447208ee62';

\ir ../seed.sql

do $$
begin
  if (select count(*) from public.establishments
      where id = '241460c5-accf-47c8-bf64-22e133edea2d') <> 1
     or (select count(*) from public.categories
      where establishment_id = '241460c5-accf-47c8-bf64-22e133edea2d') <> 9 then
    raise exception 'Second seed run created duplicates';
  end if;
  if not exists (
    select 1 from public.categories
    where id = 'c1b24d24-2bf6-495d-8d86-6b447208ee62'
      and name = 'Bebidas personalizadas'
      and slug = 'bebidas-personalizadas'
      and position = 20
      and not active
  ) then
    raise exception 'Second seed run overwrote an edited category';
  end if;
end;
$$;

rollback;
