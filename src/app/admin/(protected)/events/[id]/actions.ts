"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EventFormState } from "@/lib/admin/event-form-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { EVENT_IMAGE_BUCKET, getEventImagePath } from "@/lib/validation/event-image";
import { parseEventInput } from "@/lib/validation/event";

async function loadOwnedEvent(eventId: string) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("id, image_url").eq("id", eventId).eq("establishment_id", access.establishment.id).maybeSingle();
  return error || !data ? null : { access, supabase, event: data };
}

export async function updateEvent(eventId: string, _state: EventFormState, formData: FormData): Promise<EventFormState> {
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return { formError: "Evento não encontrado para esta conta." };
  const parsed = parseEventInput({ title: formData.get("title"), description: formData.get("description"), startsAt: formData.get("startsAt"), endsAt: formData.get("endsAt"), externalUrl: formData.get("externalUrl"), active: formData.get("active") === "on" });
  if (!parsed.success) return { formError: "Revise os campos indicados.", fieldErrors: parsed.error.flatten().fieldErrors as EventFormState["fieldErrors"] };
  if (parsed.data.active && !owned.event.image_url) return { fieldErrors: { active: "Envie um flyer antes de publicar." }, formError: "O evento ainda não pode ser publicado." };
  const { data, error } = await owned.supabase.from("events").update(parsed.data).eq("id", eventId).eq("establishment_id", owned.access.establishment.id).select("id").maybeSingle();
  if (error || !data) return { formError: "Não foi possível atualizar o evento agora." };
  revalidatePath("/admin/events"); revalidatePath(`/admin/events/${eventId}`); revalidatePath(`/${owned.access.establishment.slug}/agenda`);
  redirect(`/admin/events/${eventId}?updated=1`);
}

export type DeleteEventState = { error?: string; success?: boolean };
export async function deleteEvent(eventId: string, _state: DeleteEventState): Promise<DeleteEventState> {
  void _state;
  const owned = await loadOwnedEvent(eventId);
  if (!owned) return { error: "Evento não encontrado para esta conta." };
  const imagePath = getEventImagePath(owned.event.image_url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (imagePath) {
    const { error } = await owned.supabase.storage.from(EVENT_IMAGE_BUCKET).remove([imagePath]);
    if (error) return { error: "Não foi possível remover o flyer do evento." };
  }
  const { data, error } = await owned.supabase.from("events").delete().eq("id", eventId).eq("establishment_id", owned.access.establishment.id).select("id").maybeSingle();
  if (error || !data) return { error: "Não foi possível excluir o evento." };
  revalidatePath("/admin/events"); revalidatePath(`/${owned.access.establishment.slug}/agenda`);
  redirect("/admin/events?deleted=1");
}
