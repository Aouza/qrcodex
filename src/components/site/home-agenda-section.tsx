import { loadHomeEvents } from "@/lib/site/load-home-events";
import { HomeAgenda } from "./home-agenda";

export async function HomeAgendaSection({ reservationHref, review }: { reservationHref?: string | null; review?: boolean }) {
  return <HomeAgenda result={await loadHomeEvents()} reservationHref={reservationHref} review={review} />;
}
