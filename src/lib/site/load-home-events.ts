import "server-only";
import { loadPublicAgenda } from "@/lib/agenda/load-public-agenda";
import type { PublicAgendaEvent } from "@/lib/agenda/resolve-public-agenda-result";

export type HomeEventsResult = {
  status: "ready" | "empty" | "error" | "loading";
  events: PublicAgendaEvent[];
};

export async function loadHomeEvents(now = new Date()): Promise<HomeEventsResult> {
  try {
    const agenda = await loadPublicAgenda("relicas", now, { limit: 4, signal: AbortSignal.timeout(2000) });
    const events = agenda?.events ?? [];
    return { status: events.length ? "ready" : "empty", events };
  } catch {
    // Availability of this section must not take down the hero or navigation.
    return { status: "error", events: [] };
  }
}
