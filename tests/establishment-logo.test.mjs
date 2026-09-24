import assert from "node:assert/strict";
import test from "node:test";
import { getEstablishmentLogo } from "../src/lib/menu/get-establishment-logo.ts";
import {
  ESTABLISHMENT_LOGO_MAX_BYTES,
  getEstablishmentLogoPath,
  validateEstablishmentLogo,
} from "../src/lib/validation/establishment-logo.ts";

test("uses persisted logos first and scopes the local fallback to Relica's", () => {
  assert.equal(getEstablishmentLogo("https://example.test/logo.webp", "relicas"), "https://example.test/logo.webp");
  assert.equal(getEstablishmentLogo(null, "relicas"), "/images/logo/relicas-logo.jpg");
  assert.equal(getEstablishmentLogo(null, "another-bar"), null);
});

test("validates establishment logo type and size", () => {
  assert.deepEqual(validateEstablishmentLogo(new File(["logo"], "logo.webp", { type: "image/webp" })), { ok: true, extension: "webp" });
  assert.equal(validateEstablishmentLogo(new File([], "empty.png", { type: "image/png" })).ok, false);
  assert.equal(validateEstablishmentLogo(new File(["svg"], "logo.svg", { type: "image/svg+xml" })).ok, false);
  assert.equal(validateEstablishmentLogo(new File([new Uint8Array(ESTABLISHMENT_LOGO_MAX_BYTES + 1)], "large.jpg", { type: "image/jpeg" })).ok, false);
});

test("extracts only configured establishment image paths", () => {
  const projectUrl = "https://project.supabase.co";
  const path = "tenant-id/logo/version.webp";
  assert.equal(getEstablishmentLogoPath(`${projectUrl}/storage/v1/object/public/establishment-images/${path}`, projectUrl), path);
  assert.equal(getEstablishmentLogoPath("https://other.test/storage/v1/object/public/establishment-images/test.webp", projectUrl), null);
  assert.equal(getEstablishmentLogoPath(`${projectUrl}/storage/v1/object/public/category-images/test.webp`, projectUrl), null);
});
