"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CategoryFormState } from "@/lib/admin/category-form-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validation/category";

export async function updateCategory(categoryId: string, _state: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return { formError: "Sua sessão não permite editar categorias." };
  const parsed = categorySchema.safeParse({ name: formData.get("name"), slug: formData.get("slug") });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { formError: "Revise os campos indicados.", fieldErrors: { name: errors.name?.[0], slug: errors.slug?.[0] } };
  }

  const supabase = await createClient();
  const { data: duplicate } = await supabase.from("categories").select("id").eq("establishment_id", access.establishment.id).eq("slug", parsed.data.slug).neq("id", categoryId).maybeSingle();
  if (duplicate) return { fieldErrors: { slug: "Este identificador já está em uso." } };

  const { data, error } = await supabase.from("categories").update(parsed.data).eq("id", categoryId).eq("establishment_id", access.establishment.id).select("id").maybeSingle();
  if (error) return { formError: "Não foi possível atualizar a categoria agora." };
  if (!data) return { formError: "Categoria não encontrada para esta conta." };

  revalidatePath("/admin/categories");
  revalidatePath(`/${access.establishment.slug}`);
  redirect("/admin/categories?updated=1");
}
