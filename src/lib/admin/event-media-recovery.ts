import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export async function loadOwnedEvent(eventId: string) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("id, image_url, active")
    .eq("id", eventId).eq("establishment_id", access.establishment.id).maybeSingle();
  return error || !data ? null : { access, supabase, event: data };
}

type OwnedEvent = NonNullable<Awaited<ReturnType<typeof loadOwnedEvent>>>;

export function revalidateEventPaths(slug: string, eventId: string) {
  for (const path of ["/admin/events", `/admin/events/${eventId}`, `/${slug}`, `/${slug}/agenda`]) revalidatePath(path);
}

export async function detachEventImage(owned: OwnedEvent) {
  const query = owned.supabase.from("events").update({ image_url: null, active: false })
    .eq("id", owned.event.id).eq("establishment_id", owned.access.establishment.id);
  // Do not detach an image replaced by another action after our ownership read.
  const current = owned.event.image_url === null ? query.is("image_url", null) : query.eq("image_url", owned.event.image_url);
  const { data, error } = await current.select("id").maybeSingle();
  revalidateEventPaths(owned.access.establishment.slug, owned.event.id);
  if (error || !data) return false;
  return true;
}

export async function restoreDraftImage(owned: OwnedEvent) {
  // Storage errors can be uncertain: restore a reference, never publication,
  // and never overwrite a concurrent replacement.
  const { data, error } = await owned.supabase.from("events")
    .update({ image_url: owned.event.image_url, active: false })
    .eq("id", owned.event.id).eq("establishment_id", owned.access.establishment.id)
    .is("image_url", null).eq("active", false).select("id").maybeSingle();
  revalidateEventPaths(owned.access.establishment.slug, owned.event.id);
  return !error && Boolean(data);
}
