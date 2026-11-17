// Local built-server transport fixture. Every outbound request is intercepted;
// no real database, credential validation, mutation or provider is contacted.
import { readFileSync } from "node:fs";

globalThis.fetch = async (input) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input : input.url);
  const state = JSON.parse(readFileSync(process.env.SITE_HOME_FIXTURE_STATE, "utf8"));
  if (state.fail) return Response.json({ message: "Fixture unavailable" }, { status: 503 });
  if (url.pathname === "/rest/v1/establishments") {
    return Response.json([{ id: "55000000-0000-4000-8000-000000000001", slug: "relicas", active: true,
      name: "Fixture Bar", logo_url: null, whatsapp: state.whatsapp ?? null, instagram: state.instagram ?? null }]);
  }
  if (url.pathname === "/rest/v1/events") {
    let events = state.events.filter(event => event.active && event.image_url &&
      event.establishment_id === "55000000-0000-4000-8000-000000000001" &&
      Date.parse(event.ends_at ?? event.starts_at) >= Date.now());
    events.sort((a,b)=>a.starts_at.localeCompare(b.starts_at)||a.id.localeCompare(b.id));
    if (url.searchParams.has("limit")) events = events.slice(0,Number(url.searchParams.get("limit")));
    return Response.json(events);
  }
  throw Error("Outbound request blocked by isolated site fixture");
};
