import assert from "node:assert/strict";
import test from "node:test";
import { eventLoaderFixture } from "./fixtures/public-event-loaders.mjs";

const { loadHomeEvents } = await import("../src/lib/site/load-home-events.ts");
const now = new Date("2026-11-16T12:00:00Z");
const establishment = { id: "tenant", name: "Relica's", slug: "relicas", logo_url: null };
const event = (id, date, extra = {}) => ({ id, establishment_id: "tenant", active: true, title: id,
  description: null, starts_at: date, ends_at: null, image_url: "https://example.test/flyer.webp", external_url: null, ...extra });

test("home reads at most two relevant published events from the current Sao Paulo week", async () => {
  const rows = [
    ...Array.from({length: 25}, (_,i) => event(`past-${i}`, "2026-11-01T21:00:00Z")),
    event("no-image", "2026-11-16T11:00:00Z", { ends_at: "2026-11-16T14:00:00Z", image_url: null }),
    event("ongoing", "2026-11-16T11:30:00Z", { ends_at: "2026-11-16T14:00:00Z" }),
    event("draft", "2026-11-17T21:00:00Z", { active: false }),
    event("other", "2026-11-17T21:00:00Z", { establishment_id: "other" }),
    ...[5,4,3,2,1].map(i=>event(`future-${i}`, `2026-11-${20+i}T21:00:00Z`)),
  ];
  const fixture = eventLoaderFixture(establishment, rows);
  const result = await loadHomeEvents(now);
  assert.equal(result.status, "ready");
  assert.deepEqual(result.events.map(e=>e.id), ["ongoing","future-1"]);
  assert.equal(fixture.eventRequest().searchParams.get("limit"), "2");
  assert.deepEqual(fixture.eventRequest().searchParams.getAll("starts_at"), ["gte.2026-11-16T03:00:00.000Z", "lt.2026-11-23T03:00:00.000Z"]);
  assert.equal(fixture.eventRequest().searchParams.get("establishment_id"), "eq.tenant");
});

test("empty week does not borrow next week's shows; complete Agenda still contains them", async () => {
  eventLoaderFixture(establishment, [event("next-week", "2026-11-24T21:00:00Z")]);
  assert.deepEqual(await loadHomeEvents(now), { status: "empty", events: [] });
  const { loadPublicAgenda } = await import("../src/lib/agenda/load-public-agenda.ts");
  assert.deepEqual((await loadPublicAgenda("relicas", now)).events.map(e => e.id), ["next-week"]);
});

test("weekly selection includes Sunday local time and switches exactly at Monday midnight", async () => {
  const rows = [
    event("previous-week-ongoing", "2026-11-15T22:00:00Z", { ends_at: "2026-11-23T06:00:00Z" }),
    event("sunday-late", "2026-11-23T02:59:00Z", { ends_at: "2026-11-23T05:00:00Z" }),
    event("monday", "2026-11-23T03:00:00Z"),
  ];
  eventLoaderFixture(establishment, rows);
  assert.deepEqual((await loadHomeEvents(new Date("2026-11-22T22:00:00Z"))).events.map(e => e.id), ["sunday-late"]);
  eventLoaderFixture(establishment, rows);
  assert.deepEqual((await loadHomeEvents(new Date("2026-11-23T03:00:00Z"))).events.map(e => e.id), ["monday"]);
});

test("fresh home reads reflect publication, media removal and deletion", async () => {
  const rows = [event("a","2026-11-20T21:00:00Z"),event("b","2026-11-21T21:00:00Z")];
  eventLoaderFixture(establishment,rows);
  assert.equal((await loadHomeEvents(now)).events.length,2);
  rows[0].active=false;
  assert.deepEqual((await loadHomeEvents(now)).events.map(e=>e.id),["b"]);
  rows[1].image_url=null;
  assert.equal((await loadHomeEvents(now)).status,"empty");
  rows.splice(0,rows.length);
  assert.equal((await loadHomeEvents(now)).status,"empty");
});

test("unknown/inactive establishment and absent events do not manufacture shows", async () => {
  eventLoaderFixture({...establishment,slug:"other"},[]);
  assert.deepEqual(await loadHomeEvents(now),{status:"empty",events:[]});
});

test("database errors are isolated from the home and do not expose internal messages", async () => {
  globalThis.publicEventTestClient={from(){throw Error("private infrastructure failure");}};
  assert.deepEqual(await loadHomeEvents(now),{status:"error",events:[]});
});
