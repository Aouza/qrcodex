import assert from "node:assert/strict";
import test from "node:test";
import { eventLoaderFixture, loadPublicAgenda, resolvePublicAgendaResult } from "./fixtures/public-event-loaders.mjs";

const establishment = { id: "tenant", name: "Relica's", slug: "relicas", logo_url: null };
const now = new Date("2026-09-24T12:00:00.000Z");

test("returns upcoming and ongoing published events in chronological order", () => {
  const result = resolvePublicAgendaResult(
    { data: establishment, error: null },
    {
      data: [
        { id: "later", title: "Later", description: null, starts_at: "2026-10-02T22:00:00Z", ends_at: null, image_url: "https://example.test/later.webp", external_url: null },
        { id: "past", title: "Past", description: null, starts_at: "2026-09-20T22:00:00Z", ends_at: null, image_url: "https://example.test/past.webp", external_url: null },
        { id: "ongoing", title: "Ongoing", description: null, starts_at: "2026-09-24T10:00:00Z", ends_at: "2026-09-24T13:00:00Z", image_url: "https://example.test/ongoing.webp", external_url: "https://tickets.example/show" },
      ],
      error: null,
    },
    now,
  );

  assert.deepEqual(result.events.map(({ id }) => id), ["ongoing", "later"]);
});

test("excludes rows without media and removes unsafe external links", () => {
  const result = resolvePublicAgendaResult(
    { data: establishment, error: null },
    {
      data: [
        { id: "no-image", title: "Draft leak", description: null, starts_at: "2026-10-01T22:00:00Z", ends_at: null, image_url: null, external_url: null },
        { id: "unsafe", title: "Unsafe link", description: null, starts_at: "2026-10-01T22:00:00Z", ends_at: null, image_url: "https://example.test/flyer.webp", external_url: "javascript:alert(1)" },
      ],
      error: null,
    },
    now,
  );

  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].external_url, null);
});

test("returns null for unknown establishments and fails safely on query errors", () => {
  assert.equal(resolvePublicAgendaResult({ data: null, error: null }, null, now), null);
  assert.throws(
    () => resolvePublicAgendaResult({ data: establishment, error: null }, { data: null, error: { details: "secret" } }, now),
    { message: "Failed to load the public Agenda." },
  );
});

test("Agenda query excludes historical events while preserving inclusive ongoing and no-end boundaries", async () => {
  const event = (id, starts_at, ends_at = null, extra = {}) => ({
    id, establishment_id: establishment.id, active: true, title: id, description: null,
    starts_at, ends_at, image_url: "https://example.test/flyer.webp", external_url: null, ...extra,
  });
  const fixture = eventLoaderFixture(establishment, [
    event("future-b", "2026-10-02T22:00:00.000Z"),
    event("past", "2026-09-20T22:00:00.000Z"),
    event("ongoing", "2026-09-24T10:00:00.000Z", "2026-09-24T13:00:00.000Z"),
    event("ends-now", "2026-09-24T11:00:00.000Z", now.toISOString()),
    event("ended", "2026-09-24T11:00:00.000Z", "2026-09-24T11:59:59.999Z"),
    event("starts-now", now.toISOString()),
    event("future-a", "2026-10-02T22:00:00.000Z"),
    event("no-media", "2026-10-01T22:00:00.000Z", null, { image_url: null }),
    event("draft", "2026-10-01T22:00:00.000Z", null, { active: false }),
    event("other-tenant", "2026-10-01T22:00:00.000Z", null, { establishment_id: "other" }),
  ]);

  const result = await loadPublicAgenda(establishment.slug, now);
  assert.deepEqual(result.events.map(event => event.id), ["ongoing", "ends-now", "starts-now", "future-a", "future-b"]);
  const params = fixture.eventRequest().searchParams;
  assert.ok(params.has("or"), "Expired history must be filtered in the database query");
  assert.equal(params.get("establishment_id"), `eq.${establishment.id}`);
  assert.equal(params.get("active"), "eq.true");
  assert.equal(params.get("order"), "starts_at.asc,id.asc");
});
