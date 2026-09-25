import assert from "node:assert/strict";
import test from "node:test";
import {
  EVENT_IMAGE_MAX_BYTES,
  getEventImagePath,
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

test("extracts only event-image paths from the configured project", () => {
  const base = "https://project.supabase.co";
  assert.equal(
    getEventImagePath(`${base}/storage/v1/object/public/event-images/tenant/event/flyer.webp`, base),
    "tenant/event/flyer.webp",
  );
  assert.equal(getEventImagePath(`${base}/storage/v1/object/public/product-images/file.webp`, base), null);
  assert.equal(getEventImagePath("https://other.example/flyer.webp", base), null);
});
