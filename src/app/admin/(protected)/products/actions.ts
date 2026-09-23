"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export type AvailabilityState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function setProductAvailability(
  productId: string,
  available: boolean,
  _previousState: AvailabilityState,
): Promise<AvailabilityState> {
  void _previousState;
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { status: "error", message: "Sua sessão não permite alterar produtos." };
  }

  const supabase = await createClient();
  const { data: updatedProduct, error } = await supabase
    .from("products")
    .update({ available })
    .eq("id", productId)
    .eq("establishment_id", access.establishment.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { status: "error", message: "Não foi possível alterar a disponibilidade." };
  }
  if (!updatedProduct) {
    return { status: "error", message: "Produto não encontrado para este estabelecimento." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/${access.establishment.slug}`);

  return {
    status: "success",
    message: available ? "Produto marcado como disponível." : "Produto marcado como esgotado.",
  };
}
