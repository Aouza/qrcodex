import assert from "node:assert/strict";
import test from "node:test";
import { resolvePublicAgendaResult } from "../src/lib/agenda/resolve-public-agenda-result.ts";

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
