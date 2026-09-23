import assert from "node:assert/strict";
import test from "node:test";
import { categorySchema } from "../src/lib/validation/category.ts";
import { CATEGORY_IMAGE_MAX_BYTES, getCategoryImagePath, validateCategoryImage } from "../src/lib/validation/category-image.ts";
import { getCategoryImage } from "../src/lib/menu/get-category-image.ts";

test("validates category names and URL-safe slugs", () => {
  assert.equal(categorySchema.safeParse({ name: "Drinks", slug: "drinks-e-doses" }).success, true);
  assert.equal(categorySchema.safeParse({ name: "D", slug: "Drinks e Doses" }).success, false);
});

test("validates category image type and size", () => {
  assert.deepEqual(validateCategoryImage(new File(["image"], "category.webp", { type: "image/webp" })), { ok: true, extension: "webp" });
  assert.equal(validateCategoryImage(new File([new Uint8Array(CATEGORY_IMAGE_MAX_BYTES + 1)], "large.jpg", { type: "image/jpeg" })).ok, false);
});

test("prefers persisted category images and preserves scoped defaults", () => {
  assert.equal(getCategoryImage("https://example.test/custom.webp", "cervejas", "relicas"), "https://example.test/custom.webp");
  assert.equal(getCategoryImage(null, "cervejas", "relicas"), "/images/categories/cervejas.webp");
  assert.equal(getCategoryImage(null, "cervejas", "another"), "/images/categories/generic.webp");
});

test("extracts only configured category image paths", () => {
  const base = "https://project.supabase.co";
  assert.equal(getCategoryImagePath(`${base}/storage/v1/object/public/category-images/tenant/category/image.webp`, base), "tenant/category/image.webp");
  assert.equal(getCategoryImagePath("https://other.example/image.webp", base), null);
});
