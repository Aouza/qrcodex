alter table public.categories add column image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('category-images', 'category-images', true, 786432, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create or replace function private.can_manage_category_image(object_name text)
returns boolean language plpgsql stable security definer set search_path = '' as $$
declare
  folders text[] := storage.foldername(object_name);
  tenant_id uuid;
  category_id uuid;
begin
  if array_length(folders, 1) <> 2 then return false; end if;
  begin tenant_id := folders[1]::uuid; category_id := folders[2]::uuid;
  exception when invalid_text_representation then return false; end;
  return private.is_establishment_member(tenant_id) and exists (
    select 1 from public.categories c where c.id = category_id and c.establishment_id = tenant_id
  );
end;
$$;

revoke all on function private.can_manage_category_image(text) from public;
grant execute on function private.can_manage_category_image(text) to authenticated;

create policy category_images_member_insert on storage.objects for insert to authenticated
with check (bucket_id = 'category-images' and private.can_manage_category_image(name));
create policy category_images_member_select on storage.objects for select to authenticated
using (bucket_id = 'category-images' and private.can_manage_category_image(name));
create policy category_images_member_update on storage.objects for update to authenticated
using (bucket_id = 'category-images' and private.can_manage_category_image(name))
with check (bucket_id = 'category-images' and private.can_manage_category_image(name));
create policy category_images_member_delete on storage.objects for delete to authenticated
using (bucket_id = 'category-images' and private.can_manage_category_image(name));
