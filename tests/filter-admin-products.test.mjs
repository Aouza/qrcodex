import assert from "node:assert/strict";
import test from "node:test";
import { filterAdminProducts } from "../src/lib/admin/filter-admin-products.ts";

const products = [
  { id: "1", categoryId: "beer", categoryName: "Cervejas", name: "Heineken 600ml", priceCents: 1990, available: true, active: true },
  { id: "2", categoryId: "food", categoryName: "Porções", name: "Porção de batata", priceCents: 2500, available: false, active: true },
  { id: "3", categoryId: "beer", categoryName: "Cervejas", name: "Cerveja sem álcool", priceCents: 1200, available: true, active: false },
];

test("filters product names without accents or case sensitivity", () => {
  assert.deepEqual(
    filterAdminProducts(products, "ALCOOL", "").map(({ id }) => id),
    ["3"],
  );
});

test("combines product search and category filtering", () => {
  assert.deepEqual(
    filterAdminProducts(products, "cerveja", "beer").map(({ id }) => id),
    ["3"],
  );
  assert.deepEqual(filterAdminProducts(products, "batata", "beer"), []);
});

test("empty filters restore every product", () => {
  assert.equal(filterAdminProducts(products, "", "").length, products.length);
});
