"use server";

import { redirect } from "next/navigation";
import type { EventFormState } from "@/lib/admin/event-form-state";
import { detachEventImage, loadOwnedEvent, restoreDraftImage, revalidateEventPaths } from "@/lib/admin/event-media-recovery";
import { EVENT_IMAGE_BUCKET, getOwnedEventImagePath } from "@/lib/validation/event-image";
import { parseEventInput } from "@/lib/validation/event";

export async function updateEvent(eventId: string, _state: EventFormState, formData: FormData): Promise<EventFormState> {
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return { formError: "Evento não encontrado para esta conta." };
  const parsed = parseEventInput({ title: formData.get("title"), description: formData.get("description"), startsAt: formData.get("startsAt"), endsAt: formData.get("endsAt"), externalUrl: formData.get("externalUrl"), active: formData.get("active") === "on" });
  if (!parsed.success) return { formError: "Revise os campos indicados.", fieldErrors: parsed.error.flatten().fieldErrors as EventFormState["fieldErrors"] };
  if (parsed.data.active && !owned.event.image_url) return { fieldErrors: { active: "Envie um flyer antes de publicar." }, formError: "O evento ainda não pode ser publicado." };
  const { data, error } = await owned.supabase.from("events").update(parsed.data).eq("id", eventId).eq("establishment_id", owned.access.establishment.id).select("id").maybeSingle();
  if (error || !data) return { formError: "Não foi possível atualizar o evento agora." };
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  redirect(`/admin/events/${eventId}?updated=1`);
}

export type DeleteEventState = { error?: string; success?: boolean };
export async function deleteEvent(eventId: string, _state: DeleteEventState): Promise<DeleteEventState> {
  void _state;
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return { error: "Evento não encontrado para esta conta." };
  const imagePath = getOwnedEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", owned.access.establishment.id, eventId);
  if (!await detachEventImage(owned)) return { error: "Não foi possível preparar a exclusão. Atualize a página e tente novamente." };
  if (imagePath) {
    const { error } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([imagePath]);
    if (error) {
      const restored = await restoreDraftImage(owned);
      return { error: restored
        ? "Não foi possível remover o flyer. O evento foi mantido como rascunho; confira a imagem antes de publicar novamente."
        : "A exclusão não foi concluída. O evento ficou em rascunho sem flyer; a recuperação precisa de revisão." };
    }
  }
  const { data, error } = await owned.supabase.from("events").delete().eq("id", eventId).eq("establishment_id", owned.access.establishment.id).is("image_url", null).eq("active", false).select("id").maybeSingle();
  if (error || !data) return { error: "Não foi possível concluir a exclusão. Atualize a página para conferir o rascunho antes de tentar novamente." };
  revalidateEventPaths(owned.access.establishment.slug, eventId);
  redirect("/admin/events?deleted=1");
}
