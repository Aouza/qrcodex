import assert from "node:assert/strict";
import test from "node:test";
import { filterMenuCategories } from "../src/lib/menu/filter-menu-categories.ts";

const categories = [
  {
    id: "drinks",
    name: "Drinks",
    products: [
      { id: "one", name: "Caipirinha da Casa", description: "Limão e cachaça", available: true, featured: true },
      { id: "two", name: "Gin Tônica", description: null, available: true, featured: false },
    ],
  },
  {
    id: "beers",
    name: "Cervejas",
    products: [
      { id: "three", name: "Heineken 600ml", description: "Cerveja puro malte", available: false, featured: false },
    ],
  },
];

test("filters by name and description without losing category grouping or product state", () => {
  const byName = filterMenuCategories(categories, "  HEINEKEN  ");
  assert.deepEqual(byName.map((category) => category.id), ["beers"]);
  assert.equal(byName[0].products[0], categories[1].products[0]);
  assert.equal(byName[0].products[0].available, false);

  const byDescription = filterMenuCategories(categories, "CACHAÇA");
  assert.deepEqual(byDescription.map((category) => category.id), ["drinks"]);
  assert.deepEqual(byDescription[0].products.map((product) => product.id), ["one"]);
});

test("clearing the query restores the original menu; unmatched queries return no categories", () => {
  assert.equal(filterMenuCategories(categories, " "), categories);
  assert.deepEqual(filterMenuCategories(categories, "pizza"), []);
  assert.equal(categories[0].products.length, 2);
});
