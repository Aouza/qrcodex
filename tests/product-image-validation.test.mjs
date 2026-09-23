import assert from "node:assert/strict";
import test from "node:test";
import {
  getProductImagePath,
  PRODUCT_IMAGE_MAX_BYTES,
  validateProductImage,
} from "../src/lib/validation/product-image.ts";

test("accepts supported image types within the size limit", () => {
  const result = validateProductImage(new File(["image"], "product.webp", { type: "image/webp" }));
  assert.deepEqual(result, { ok: true, extension: "webp" });
});

test("rejects empty, unsupported and oversized files", () => {
  assert.ok("error" in validateProductImage(new File([], "empty.png", { type: "image/png" })));
  assert.ok("error" in validateProductImage(new File(["x"], "image.gif", { type: "image/gif" })));
  const oversized = new File([new Uint8Array(PRODUCT_IMAGE_MAX_BYTES + 1)], "large.jpg", { type: "image/jpeg" });
  assert.ok("error" in validateProductImage(oversized));
});

test("extracts only configured product-image paths", () => {
  const base = "https://project.supabase.co";
  assert.equal(
    getProductImagePath(`${base}/storage/v1/object/public/product-images/tenant/product/image.webp`, base),
    "tenant/product/image.webp",
  );
  assert.equal(getProductImagePath("https://other.example/image.webp", base), null);
});
