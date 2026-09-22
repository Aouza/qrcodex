-- Development data only. Apply manually to a confirmed development database.
-- Stable IDs keep repeated runs from recreating categories after admin edits.
insert into public.establishments (id, name, slug)
values (
  '241460c5-accf-47c8-bf64-22e133edea2d',
  'Relica''s Rock & Bar',
  'relicas'
)
on conflict (id) do nothing;

insert into public.categories (id, establishment_id, name, slug, position)
values
  ('c6f8e31c-6071-42b7-857a-c9ac38f869ed', '241460c5-accf-47c8-bf64-22e133edea2d', 'Porções', 'porcoes', 0),
  ('da7d13d1-2dfe-42b7-af93-9e4992222a75', '241460c5-accf-47c8-bf64-22e133edea2d', 'Lanches', 'lanches', 1),
  ('c1b24d24-2bf6-495d-8d86-6b447208ee62', '241460c5-accf-47c8-bf64-22e133edea2d', 'Bebidas', 'bebidas', 2),
  ('653be2e7-ea07-4802-adbb-c46cc8656d71', '241460c5-accf-47c8-bf64-22e133edea2d', 'Drinks e Doses', 'drinks-e-doses', 3),
  ('2f756bb8-53dc-4bf0-aeb3-868682d28a15', '241460c5-accf-47c8-bf64-22e133edea2d', 'Cachaças', 'cachacas', 4),
  ('6b50bf9c-d27a-49c8-b607-01b25cc4aa1a', '241460c5-accf-47c8-bf64-22e133edea2d', 'Cervejas', 'cervejas', 5),
  ('a4d5a30b-20a1-4ea8-9dc7-00a977e5164f', '241460c5-accf-47c8-bf64-22e133edea2d', 'Caipirinhas', 'caipirinhas', 6),
  ('bbce2238-f253-45f4-bca5-3e5254362b93', '241460c5-accf-47c8-bf64-22e133edea2d', 'Vinhos', 'vinhos', 7),
  ('f194c3ba-0386-4231-b3fd-fb8e3f0c2323', '241460c5-accf-47c8-bf64-22e133edea2d', 'Whiskies', 'whiskies', 8)
on conflict (id) do nothing;
