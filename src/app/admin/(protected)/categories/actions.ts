"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export type CategoryActiveState = { status: "idle" | "success" | "error"; message?: string };

export async function setCategoryActive(categoryId: string, active: boolean, _state: CategoryActiveState): Promise<CategoryActiveState> {
  void _state;
  const access = await getAdminAccess();
  if (access.status !== "authorized") return { status: "error", message: "Sua sessão não permite alterar categorias." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").update({ active }).eq("id", categoryId).eq("establishment_id", access.establishment.id).select("id").maybeSingle();
  if (error) return { status: "error", message: "Não foi possível alterar a categoria." };
  if (!data) return { status: "error", message: "Categoria não encontrada para este estabelecimento." };

  revalidatePath("/admin/categories");
  revalidatePath(`/${access.establishment.slug}`);
  return { status: "success", message: active ? "Categoria ativada." : "Categoria desativada." };
}
