"use server";

import { detachEventImage, loadOwnedEvent, restoreDraftImage, revalidateEventPaths } from "@/lib/admin/event-media-recovery";
import { EVENT_IMAGE_BUCKET, getOwnedEventImagePath, validateEventImage } from "@/lib/validation/event-image";

export type EventImageState = { status: "idle" | "success" | "error"; message?: string };
const failure = (message: string): EventImageState => ({ status: "error", message });

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
  if (error) {
    // The write may have committed before its response failed. Never remove a
    // possibly referenced upload; let an authorized recovery inspect its state.
    revalidateEventPaths(owned.access.establishment.slug, eventId);
    return failure("Não foi possível confirmar o vínculo do flyer. Atualize a página para conferir o evento; o envio foi preservado para revisão.");
  }
  if (!data) {
    const { error: cleanupError } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([path]);
    return failure(cleanupError ? "O flyer não foi vinculado e a limpeza do envio precisa de revisão." : "Não foi possível vincular o flyer ao evento.");
  }
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  const previousPath = getOwnedEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", owned.access.establishment.id, eventId);
  if (previousPath) {
    const { error: removeError } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([previousPath]);
    if (removeError) return failure("O novo flyer foi salvo, mas a limpeza do anterior precisa de revisão.");
  }
  return { status: "success", message: "Flyer atualizado com sucesso." };
}

export async function removeEventImage(eventId: string, _state: EventImageState): Promise<EventImageState> {
  void _state;
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return failure("Evento não encontrado para esta conta.");
  if (!owned.event.image_url) return { status: "success", message: "O evento já está sem flyer." };
  const path = getOwnedEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", owned.access.establishment.id, eventId);
  if (!path) return failure("O flyer atual não pertence ao armazenamento configurado.");
  if (!await detachEventImage(owned)) return failure("Não foi possível remover o flyer do evento. Atualize a página e tente novamente.");
  const { error } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([path]);
  if (error) {
    const restored = await restoreDraftImage(owned);
    return failure(restored
      ? "Não foi possível remover o arquivo. O evento ficou como rascunho; confira a imagem antes de publicar novamente."
      : "A remoção não foi concluída. O evento ficou em rascunho sem flyer; a recuperação precisa de revisão.");
  }
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  return { status: "success", message: "Flyer removido e evento salvo como rascunho." };
}
