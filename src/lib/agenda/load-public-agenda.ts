import { resolvePublicAgendaResult } from "@/lib/agenda/resolve-public-agenda-result";
import { createPublicClient } from "@/lib/supabase/public";

export async function loadPublicAgenda(slug: string, now = new Date()) {
  const supabase = createPublicClient();
  const establishmentResult = await supabase
    .from("establishments")
    .select("id, name, slug, logo_url")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (establishmentResult.error || !establishmentResult.data) {
    return resolvePublicAgendaResult(establishmentResult, null, now);
  }

  const eventResult = await supabase
    .from("events")
    .select("id, title, description, starts_at, ends_at, image_url, external_url")
    .eq("establishment_id", establishmentResult.data.id)
    .eq("active", true)
    .order("starts_at")
    .order("id");

  return resolvePublicAgendaResult(establishmentResult, eventResult, now);
}
