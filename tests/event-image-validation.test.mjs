import assert from "node:assert/strict";
import test from "node:test";
import {
  EVENT_IMAGE_MAX_BYTES,
  getEventImagePath,
  getOwnedEventImagePath,
  validateEventImage,
} from "../src/lib/validation/event-image.ts";

test("validates event flyer formats and size", () => {
  assert.deepEqual(
    validateEventImage(new File(["image"], "flyer.webp", { type: "image/webp" })),
    { ok: true, extension: "webp" },
  );
  assert.equal(validateEventImage(new File([], "empty.png", { type: "image/png" })).ok, false);
  assert.equal(validateEventImage(new File(["image"], "flyer.gif", { type: "image/gif" })).ok, false);
  assert.equal(
    validateEventImage(
      new File([new Uint8Array(EVENT_IMAGE_MAX_BYTES + 1)], "large.jpg", { type: "image/jpeg" }),
    ).ok,
    false,
  );
});

test("media cleanup is restricted to the exact tenant and event folder", () => {
  const base = "https://project.supabase.co";
  const url = path => `${base}/storage/v1/object/public/event-images/${path}`;
  assert.equal(getOwnedEventImagePath(url("tenant/event/flyer.webp"), base, "tenant", "event"), "tenant/event/flyer.webp");
  for (const path of ["other/event/flyer.webp", "tenant/other/flyer.webp", "tenant/event/nested/flyer.webp", "tenant/event/sub%2Fflyer.webp", "tenant/event/sub%5Cflyer.webp"]) {
    assert.equal(getOwnedEventImagePath(url(path), base, "tenant", "event"), null);
  }
  assert.equal(getOwnedEventImagePath("https://other.example/flyer.webp", base, "tenant", "event"), null);
});

test("extracts only event-image paths from the configured project", () => {
  const base = "https://project.supabase.co";
  assert.equal(
    getEventImagePath(`${base}/storage/v1/object/public/event-images/tenant/event/flyer.webp`, base),
    "tenant/event/flyer.webp",
  );
  assert.equal(getEventImagePath(`${base}/storage/v1/object/public/product-images/file.webp`, base), null);
  assert.equal(getEventImagePath("https://other.example/flyer.webp", base), null);
});
