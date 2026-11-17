import { loadHomeEvents } from "@/lib/site/load-home-events";
import { HomeAgenda } from "./home-agenda";

export async function HomeAgendaSection({ reservationHref }: { reservationHref?: string | null }) {
  return <HomeAgenda result={await loadHomeEvents()} reservationHref={reservationHref} />;
}
