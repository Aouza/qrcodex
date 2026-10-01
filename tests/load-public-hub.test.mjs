import assert from "node:assert/strict";
import test from "node:test";
import { hasPublicMusic, resolvePublicHubResult } from "../src/lib/hub/resolve-public-hub-result.ts";

test("Music Hub link requires global and tenant enablement; failure is closed", () => {
  assert.equal(hasPublicMusic(false, {enabled:true}), false);
  assert.equal(hasPublicMusic(true, {enabled:false}), false);
  assert.equal(hasPublicMusic(true, null), false);
  assert.equal(hasPublicMusic(true, {enabled:true}), true);
});

const establishment = {
  id: "establishment-id",
  name: "Relica's Rock & Bar",
  slug: "relicas",
  logo_url: null,
  instagram: "relicas",
  whatsapp: null,
};

test("returns the focused public establishment result", () => {
  assert.deepEqual(
    resolvePublicHubResult({ establishmentResult: { data: establishment, error: null }, agendaResult: { data: [], error: null } }),
    { ...establishment, hasPublicAgenda: false },
  );
});

test("returns null when no active establishment matches", () => {
  assert.equal(resolvePublicHubResult({ establishmentResult: { data: null, error: null }, agendaResult: null }), null);
});

test("fails with a safe message when the public read fails", () => {
  assert.throws(
    () => resolvePublicHubResult({ establishmentResult: { data: null, error: { message: "database details" } }, agendaResult: null }),
    { message: "Failed to load the public Hub." },
  );
});

test("marks Agenda available when an upcoming public event has media", () => {
  const result = resolvePublicHubResult(
    {
      establishmentResult: { data: establishment, error: null },
      agendaResult: {
        data: [
          { id: "event-id", starts_at: "2026-10-02T22:00:00Z", ends_at: null, image_url: "https://example.test/flyer.webp" },
        ],
        error: null,
      },
    },
    new Date("2026-09-29T12:00:00Z"),
  );

  assert.equal(result.hasPublicAgenda, true);
});

test("keeps Agenda hidden when events are past or missing media", () => {
  const result = resolvePublicHubResult(
    {
      establishmentResult: { data: establishment, error: null },
      agendaResult: {
        data: [
          { id: "past", starts_at: "2026-09-20T22:00:00Z", ends_at: null, image_url: "https://example.test/past.webp" },
          { id: "no-media", starts_at: "2026-10-02T22:00:00Z", ends_at: null, image_url: null },
        ],
        error: null,
      },
    },
    new Date("2026-09-29T12:00:00Z"),
  );

  assert.equal(result.hasPublicAgenda, false);
});

test("fails safely when the Agenda availability read fails", () => {
  assert.throws(
    () =>
      resolvePublicHubResult({
        establishmentResult: { data: establishment, error: null },
        agendaResult: { data: null, error: { message: "events details" } },
      }),
    { message: "Failed to load the public Hub." },
  );
});
