import { createPublicClient } from "@/lib/supabase/public";
import { hasPublicMusic, resolvePublicHubResult, type PublicHubEstablishment } from "@/lib/hub/resolve-public-hub-result";
import { musicAvailability } from "@/lib/music/database";
import { productionMusicEnabled } from "@/lib/music/runtime";

export async function loadPublicHub(slug: string, now = new Date()): Promise<PublicHubEstablishment | null> {
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

  const result = resolvePublicHubResult({ establishmentResult, agendaResult }, now);
  // Optional module failure must never break Menu/Agenda or expose settings.
  const enabled = productionMusicEnabled();
  const music = enabled ? await musicAvailability(slug, 2000).catch(() => null) : null;
  return result ? { ...result, hasPublicMusic: hasPublicMusic(enabled, music) } : null;
}
