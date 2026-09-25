import "server-only";

import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export type AdminEvent = {
  id: string; title: string; description: string | null; starts_at: string; ends_at: string | null;
  image_url: string | null; external_url: string | null; active: boolean;
};

export async function loadAdminEvents(): Promise<AdminEvent[] | null> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events")
    .select("id, title, description, starts_at, ends_at, image_url, external_url, active")
    .eq("establishment_id", access.establishment.id).order("starts_at").order("id");
  if (error) throw new Error("Failed to load admin events.");
  return data ?? [];
}

export async function loadAdminEvent(eventId: string): Promise<AdminEvent | null | undefined> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return undefined;
  const supabase = await createClient();
  const { data, error } = await supabase.from("events")
    .select("id, title, description, starts_at, ends_at, image_url, external_url, active")
    .eq("id", eventId).eq("establishment_id", access.establishment.id).maybeSingle();
  if (error) throw new Error("Failed to load admin event.");
  return data;
}
