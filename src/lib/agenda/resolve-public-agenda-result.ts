export type PublicAgendaEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  image_url: string;
  external_url: string | null;
};

type EventRow = Omit<PublicAgendaEvent, "image_url"> & { image_url: string | null };

type QueryResult<T> = { data: T | null; error: unknown };

function safeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function resolvePublicAgendaResult(
  establishmentResult: QueryResult<{ id: string; name: string; slug: string; logo_url: string | null }>,
  eventResult: QueryResult<EventRow[]> | null,
  now = new Date(),
) {
  if (establishmentResult.error || eventResult?.error) {
    throw new Error("Failed to load the public Agenda.");
  }
  if (!establishmentResult.data) return null;

  const nowTime = now.getTime();
  const events = (eventResult?.data ?? [])
    .filter((event): event is EventRow & { image_url: string } => {
      if (!event.image_url) return false;
      const lastRelevantTime = new Date(event.ends_at ?? event.starts_at).getTime();
      return Number.isFinite(lastRelevantTime) && lastRelevantTime >= nowTime;
    })
    .map((event) => ({ ...event, external_url: safeExternalUrl(event.external_url) }))
    .sort((left, right) => left.starts_at.localeCompare(right.starts_at) || left.id.localeCompare(right.id));

  return { establishment: establishmentResult.data, events };
}
