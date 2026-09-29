import { createPublicClient } from "@/lib/supabase/public";
import { resolvePublicHubResult } from "@/lib/hub/resolve-public-hub-result";

export async function loadPublicHub(slug: string, now = new Date()) {
  const supabase = createPublicClient();
  const establishmentResult = await supabase
    .from("establishments")
    .select("id, name, slug, logo_url, instagram, whatsapp")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (establishmentResult.error || !establishmentResult.data) {
    return resolvePublicHubResult({ establishmentResult, agendaResult: null }, now);
  }

  const agendaResult = await supabase
    .from("events")
    .select("id, starts_at, ends_at, image_url")
    .eq("establishment_id", establishmentResult.data.id)
    .eq("active", true)
    .order("starts_at")
    .order("id")
    .limit(24);

  return resolvePublicHubResult({ establishmentResult, agendaResult }, now);
}
