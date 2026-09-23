"use server";

import { revalidatePath } from "next/cache";
import type { EstablishmentSettingsState } from "@/lib/admin/establishment-settings-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { establishmentSettingsSchema } from "@/lib/validation/establishment";

export async function updateEstablishmentSettings(_state: EstablishmentSettingsState, formData: FormData): Promise<EstablishmentSettingsState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return { formError: "Sua sessão não permite alterar o estabelecimento." };
  const parsed = establishmentSettingsSchema.safeParse({ name: formData.get("name"), instagram: formData.get("instagram") ?? "", whatsapp: formData.get("whatsapp") ?? "" });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { formError: "Revise os campos indicados.", fieldErrors: { name: errors.name?.[0], instagram: errors.instagram?.[0], whatsapp: errors.whatsapp?.[0] } };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("establishments").update(parsed.data).eq("id", access.establishment.id).select("id").maybeSingle();
  if (error) return { formError: "Não foi possível atualizar as configurações agora." };
  if (!data) return { formError: "Estabelecimento não encontrado para esta conta." };
  revalidatePath("/admin"); revalidatePath("/admin/settings"); revalidatePath(`/${access.establishment.slug}`);
  return { success: "Configurações atualizadas com sucesso." };
}
