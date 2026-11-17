import { resolvePublicAgendaResult } from "@/lib/agenda/resolve-public-agenda-result";
import { publicEventTimeFilter } from "@/lib/agenda/public-event-time";
import { createPublicClient } from "@/lib/supabase/public";

export async function loadPublicAgenda(slug: string, now = new Date(), options: {
  limit?: number;
  signal?: AbortSignal;
  startsAtRange?: { from: string; before: string };
} = {}) {
  const supabase = createPublicClient();
  const establishmentQuery = supabase
    .from("establishments")
    .select("id, name, slug, logo_url")
    .eq("slug", slug)
    .eq("active", true);
  if (options.signal) establishmentQuery.abortSignal(options.signal);
  const establishmentResult = await establishmentQuery.maybeSingle();

  if (establishmentResult.error || !establishmentResult.data) {
    return resolvePublicAgendaResult(establishmentResult, null, now);
  }

  const eventQuery = supabase
    .from("events")
    .select("id, title, description, starts_at, ends_at, image_url, external_url")
    .eq("establishment_id", establishmentResult.data.id)
    .eq("active", true)
    .or(publicEventTimeFilter(now))
    .order("starts_at")
    .order("id");
  if (options.startsAtRange) eventQuery.gte("starts_at", options.startsAtRange.from).lt("starts_at", options.startsAtRange.before);
  if (options.limit !== undefined) eventQuery.not("image_url", "is", null).limit(options.limit);
  if (options.signal) eventQuery.abortSignal(options.signal);
  const eventResult = await eventQuery;

  return resolvePublicAgendaResult(establishmentResult, eventResult, now);
}
