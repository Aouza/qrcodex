"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_IMAGE_BUCKET, getCategoryImagePath, validateCategoryImage } from "@/lib/validation/category-image";

export type CategoryImageState = { status: "idle" | "success" | "error"; message?: string };
const failure = (message: string): CategoryImageState => ({ status: "error", message });

async function loadOwnedCategory(categoryId: string) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, image_url").eq("id", categoryId).eq("establishment_id", access.establishment.id).maybeSingle();
  return error || !data ? null : { access, supabase, category: data };
}

export async function uploadCategoryImage(categoryId: string, _state: CategoryImageState, formData: FormData): Promise<CategoryImageState> {
  void _state;
  const owned = await loadOwnedCategory(categoryId);
  if (!owned) return failure("Categoria não encontrada para esta conta.");
  const file = formData.get("image");
  if (!(file instanceof File)) return failure("Selecione uma imagem.");
  const validation = validateCategoryImage(file);
  if (!validation.ok) return failure(validation.error);

  const path = `${owned.access.establishment.id}/${owned.category.id}/${crypto.randomUUID()}.${validation.extension}`;
  const { error: uploadError } = await owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return failure("Não foi possível enviar a imagem agora.");
  const { data: publicData } = owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).getPublicUrl(path);
  const { data: updated, error: updateError } = await owned.supabase.from("categories").update({ image_url: publicData.publicUrl }).eq("id", owned.category.id).eq("establishment_id", owned.access.establishment.id).select("id").maybeSingle();
  if (updateError || !updated) {
    await owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).remove([path]);
    return failure("Não foi possível vincular a imagem à categoria.");
  }

  const previousPath = getCategoryImagePath(owned.category.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (previousPath) {
    const { error } = await owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).remove([previousPath]);
    if (error) {
      await owned.supabase.from("categories").update({ image_url: owned.category.image_url }).eq("id", owned.category.id).eq("establishment_id", owned.access.establishment.id);
      await owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).remove([path]);
      return failure("Não foi possível substituir a imagem anterior.");
    }
  }

  revalidatePath(`/admin/categories/${categoryId}`); revalidatePath("/admin/categories"); revalidatePath(`/${owned.access.establishment.slug}/cardapio`);
  return { status: "success", message: "Imagem atualizada com sucesso." };
}

export async function removeCategoryImage(categoryId: string, _state: CategoryImageState): Promise<CategoryImageState> {
  void _state;
  const owned = await loadOwnedCategory(categoryId);
  if (!owned) return failure("Categoria não encontrada para esta conta.");
  if (!owned.category.image_url) return { status: "success", message: "A categoria já está sem imagem personalizada." };
  const path = getCategoryImagePath(owned.category.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (!path) return failure("A imagem atual não pertence ao armazenamento configurado.");
  const { error: updateError } = await owned.supabase.from("categories").update({ image_url: null }).eq("id", owned.category.id).eq("establishment_id", owned.access.establishment.id);
  if (updateError) return failure("Não foi possível remover a imagem da categoria.");
  const { error } = await owned.supabase.storage.from(CATEGORY_IMAGE_BUCKET).remove([path]);
  if (error) {
    await owned.supabase.from("categories").update({ image_url: owned.category.image_url }).eq("id", owned.category.id).eq("establishment_id", owned.access.establishment.id);
    return failure("Não foi possível remover o arquivo da imagem.");
  }
  revalidatePath(`/admin/categories/${categoryId}`); revalidatePath("/admin/categories"); revalidatePath(`/${owned.access.establishment.slug}/cardapio`);
  return { status: "success", message: "Imagem removida; o padrão voltou a ser usado." };
}
