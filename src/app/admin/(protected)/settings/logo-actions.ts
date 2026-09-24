"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import {
  ESTABLISHMENT_IMAGE_BUCKET,
  getEstablishmentLogoPath,
  validateEstablishmentLogo,
} from "@/lib/validation/establishment-logo";

export type EstablishmentLogoState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const failure = (message: string): EstablishmentLogoState => ({ status: "error", message });

async function loadOwnedEstablishment() {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("establishments")
    .select("id, slug, logo_url")
    .eq("id", access.establishment.id)
    .maybeSingle();

  return error || !data ? null : { access, supabase, establishment: data };
}

export async function uploadEstablishmentLogo(
  _state: EstablishmentLogoState,
  formData: FormData,
): Promise<EstablishmentLogoState> {
  void _state;
  const owned = await loadOwnedEstablishment();
  if (!owned) return failure("Estabelecimento não encontrado para esta conta.");

  const file = formData.get("image");
  if (!(file instanceof File)) return failure("Selecione uma imagem.");
  const validation = validateEstablishmentLogo(file);
  if (!validation.ok) return failure(validation.error);

  const path = `${owned.establishment.id}/logo/${crypto.randomUUID()}.${validation.extension}`;
  const { error: uploadError } = await owned.supabase.storage
    .from(ESTABLISHMENT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return failure("Não foi possível enviar a logo agora.");

  const { data: publicData } = owned.supabase.storage
    .from(ESTABLISHMENT_IMAGE_BUCKET)
    .getPublicUrl(path);
  const { data: updated, error: updateError } = await owned.supabase
    .from("establishments")
    .update({ logo_url: publicData.publicUrl })
    .eq("id", owned.establishment.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    await owned.supabase.storage.from(ESTABLISHMENT_IMAGE_BUCKET).remove([path]);
    return failure("Não foi possível vincular a logo ao estabelecimento.");
  }

  const previousPath = getEstablishmentLogoPath(
    owned.establishment.logo_url,
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  );
  if (previousPath) {
    const { error } = await owned.supabase.storage
      .from(ESTABLISHMENT_IMAGE_BUCKET)
      .remove([previousPath]);
    if (error) {
      await owned.supabase
        .from("establishments")
        .update({ logo_url: owned.establishment.logo_url })
        .eq("id", owned.establishment.id);
      await owned.supabase.storage.from(ESTABLISHMENT_IMAGE_BUCKET).remove([path]);
      return failure("Não foi possível substituir a logo anterior.");
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath(`/${owned.establishment.slug}`);
  return { status: "success", message: "Logo atualizada com sucesso." };
}

export async function removeEstablishmentLogo(
  _state: EstablishmentLogoState,
): Promise<EstablishmentLogoState> {
  void _state;
  const owned = await loadOwnedEstablishment();
  if (!owned) return failure("Estabelecimento não encontrado para esta conta.");
  if (!owned.establishment.logo_url) {
    return { status: "success", message: "A logo padrão já está em uso." };
  }

  const path = getEstablishmentLogoPath(
    owned.establishment.logo_url,
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  );
  if (!path) return failure("A logo atual não pertence ao armazenamento configurado.");

  const { error: updateError } = await owned.supabase
    .from("establishments")
    .update({ logo_url: null })
    .eq("id", owned.establishment.id);
  if (updateError) return failure("Não foi possível remover a logo.");

  const { error } = await owned.supabase.storage
    .from(ESTABLISHMENT_IMAGE_BUCKET)
    .remove([path]);
  if (error) {
    await owned.supabase
      .from("establishments")
      .update({ logo_url: owned.establishment.logo_url })
      .eq("id", owned.establishment.id);
    return failure("Não foi possível remover o arquivo da logo.");
  }

  revalidatePath("/admin/settings");
  revalidatePath(`/${owned.establishment.slug}`);
  return { status: "success", message: "Logo removida; o padrão voltou a ser usado." };
}
