import { loadHomeEvents } from "@/lib/site/load-home-events";
import { HomeAgenda } from "./home-agenda";

export async function HomeAgendaSection() {
  return <HomeAgenda result={await loadHomeEvents()} />;
}
