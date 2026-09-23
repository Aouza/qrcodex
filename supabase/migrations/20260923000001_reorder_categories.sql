create or replace function public.reorder_category(tenant_id uuid, category_id uuid, direction integer)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  ordered_ids uuid[];
  current_index integer;
  destination integer;
  swap_id uuid;
  item_id uuid;
  item_index integer;
begin
  if direction not in (-1, 1) or not private.is_establishment_member(tenant_id) then return false; end if;

  perform c.id from public.categories c
  where c.establishment_id = tenant_id
  order by c.position, c.id
  for update;

  select array_agg(c.id order by c.position, c.id)
  into ordered_ids
  from public.categories c
  where c.establishment_id = tenant_id;

  current_index := array_position(ordered_ids, category_id);
  if current_index is null then return false; end if;
  destination := current_index + direction;
  if destination < 1 or destination > coalesce(array_length(ordered_ids, 1), 0) then return false; end if;

  swap_id := ordered_ids[destination];
  ordered_ids[destination] := category_id;
  ordered_ids[current_index] := swap_id;

  for item_index in 1..array_length(ordered_ids, 1) loop
    item_id := ordered_ids[item_index];
    update public.categories set position = item_index - 1
    where id = item_id and establishment_id = tenant_id;
  end loop;
  return true;
end;
$$;

revoke all on function public.reorder_category(uuid, uuid, integer) from public, anon;
grant execute on function public.reorder_category(uuid, uuid, integer) to authenticated;
