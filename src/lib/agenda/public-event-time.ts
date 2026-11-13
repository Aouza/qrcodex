type EventTime = { starts_at: string; ends_at: string | null };

// With no end, relevance lasts through the start instant. Keep both query and
// defensive in-memory checks inclusive; never infer a default event duration.
export function publicEventTimeFilter(now: Date) {
  const instant = now.toISOString();
  return `ends_at.gte.${instant},and(ends_at.is.null,starts_at.gte.${instant})`;
}

export function isCurrentOrUpcomingEvent(event: EventTime, now: Date) {
  const lastRelevantTime = new Date(event.ends_at ?? event.starts_at).getTime();
  return Number.isFinite(lastRelevantTime) && lastRelevantTime >= now.getTime();
}
