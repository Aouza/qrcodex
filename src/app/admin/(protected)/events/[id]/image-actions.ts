"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { EVENT_IMAGE_BUCKET, getEventImagePath, validateEventImage } from "@/lib/validation/event-image";

export type EventImageState = { status: "idle" | "success" | "error"; message?: string };
const failure = (message: string): EventImageState => ({ status: "error", message });

async function loadOwnedEvent(eventId: string) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("id, image_url, active").eq("id", eventId).eq("establishment_id", access.establishment.id).maybeSingle();
  return error || !data ? null : { access, supabase, event: data };
}

function revalidateEventPaths(slug: string, eventId: string) { revalidatePath("/admin/events"); revalidatePath(`/admin/events/${eventId}`); revalidatePath(`/${slug}/agenda`); }

export async function uploadEventImage(eventId: string, _state: EventImageState, formData: FormData): Promise<EventImageState> {
  void _state;
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return failure("Evento não encontrado para esta conta.");
  const file = formData.get("image");
  if (!(file instanceof File)) return failure("Selecione um flyer.");
  const validation = validateEventImage(file);
  if (!validation.ok) return failure(validation.error);
  const path = `${owned.access.establishment.id}/${eventId}/${crypto.randomUUID()}.${validation.extension}`;
  const { error: uploadError } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return failure("Não foi possível enviar o flyer agora.");
  const { data: publicData } = owned.supabase.storage.from(EVENT_IMAGE_BUCKET).getPublicUrl(path);
  const { data, error } = await owned.supabase.from("events").update({ image_url: publicData.publicUrl }).eq("id", eventId).eq("establishment_id", owned.access.establishment.id).select("id").maybeSingle();
  if (error || !data) { await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([path]); return failure("Não foi possível vincular o flyer ao evento."); }
  const previousPath = getEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (previousPath) {
    const { error: removeError } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([previousPath]);
    if (removeError) { await owned.supabase.from("events").update({ image_url: owned.event.image_url }).eq("id", eventId).eq("establishment_id", owned.access.establishment.id); await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([path]); return failure("Não foi possível substituir o flyer anterior."); }
  }
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  return { status: "success", message: "Flyer atualizado com sucesso." };
}

export async function removeEventImage(eventId: string, _state: EventImageState): Promise<EventImageState> {
  void _state;
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return failure("Evento não encontrado para esta conta.");
  if (!owned.event.image_url) return { status: "success", message: "O evento já está sem flyer." };
  const path = getEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (!path) return failure("O flyer atual não pertence ao armazenamento configurado.");
  const { error: updateError } = await owned.supabase.from("events").update({ image_url: null, active: false }).eq("id", eventId).eq("establishment_id", owned.access.establishment.id);
  if (updateError) return failure("Não foi possível remover o flyer do evento.");
  const { error } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([path]);
  if (error) { await owned.supabase.from("events").update({ image_url: owned.event.image_url, active: owned.event.active }).eq("id", eventId).eq("establishment_id", owned.access.establishment.id); return failure("Não foi possível remover o arquivo do flyer."); }
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  return { status: "success", message: "Flyer removido e evento salvo como rascunho." };
}
