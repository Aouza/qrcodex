export type PublicHubEstablishment = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  instagram: string | null;
  whatsapp: string | null;
  hasPublicAgenda: boolean;
};

type EstablishmentRow = Omit<PublicHubEstablishment, "hasPublicAgenda">;

type PublicHubEstablishmentResult = {
  data: EstablishmentRow | null;
  error: unknown;
};

type PublicHubAgendaEvent = {
  id: string;
  starts_at: string;
  ends_at: string | null;
  image_url: string | null;
};

type PublicHubAgendaResult = {
  data: PublicHubAgendaEvent[] | null;
  error: unknown;
};

type PublicHubResult = {
  establishmentResult: PublicHubEstablishmentResult;
  agendaResult: PublicHubAgendaResult | null;
};

function hasCurrentOrUpcomingEvent(events: PublicHubAgendaEvent[] | null, now: Date) {
  const nowTime = now.getTime();

  return (events ?? []).some((event) => {
    if (!event.image_url) return false;

    const lastRelevantTime = new Date(event.ends_at ?? event.starts_at).getTime();
    return Number.isFinite(lastRelevantTime) && lastRelevantTime >= nowTime;
  });
}

export function resolvePublicHubResult(
  { establishmentResult, agendaResult }: PublicHubResult,
  now = new Date(),
) {
  if (establishmentResult.error || agendaResult?.error) {
    throw new Error("Failed to load the public Hub.");
  }

  if (!establishmentResult.data) {
    return null;
  }

  return {
    ...establishmentResult.data,
    hasPublicAgenda: hasCurrentOrUpcomingEvent(agendaResult?.data ?? [], now),
  };
}
