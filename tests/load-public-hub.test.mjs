import assert from "node:assert/strict";
import test from "node:test";
import { resolvePublicHubResult } from "../src/lib/hub/resolve-public-hub-result.ts";

const establishment = {
  id: "establishment-id",
  name: "Relica's Rock & Bar",
  slug: "relicas",
  logo_url: null,
  instagram: "relicas",
  whatsapp: null,
};

test("returns the focused public establishment result", () => {
  assert.equal(resolvePublicHubResult({ data: establishment, error: null }), establishment);
});

test("returns null when no active establishment matches", () => {
  assert.equal(resolvePublicHubResult({ data: null, error: null }), null);
});

test("fails with a safe message when the public read fails", () => {
  assert.throws(
    () => resolvePublicHubResult({ data: null, error: { message: "database details" } }),
    { message: "Failed to load the public Hub." },
  );
});
