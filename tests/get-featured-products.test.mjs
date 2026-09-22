import assert from "node:assert/strict";
import test from "node:test";
import { getFeaturedProducts } from "../src/lib/menu/get-featured-products.ts";

test("selects only featured products across visible categories", () => {
  const featuredAvailable = { id: "one", featured: true, available: true };
  const regular = { id: "two", featured: false, available: true };
  const featuredUnavailable = { id: "three", featured: true, available: false };

  assert.deepEqual(
    getFeaturedProducts([
      { products: [featuredAvailable, regular] },
      { products: [featuredUnavailable] },
    ]),
    [featuredAvailable, featuredUnavailable],
  );
});

test("returns no featured section items when none are marked featured", () => {
  assert.deepEqual(getFeaturedProducts([{ products: [{ id: "one", featured: false }] }]), []);
});
