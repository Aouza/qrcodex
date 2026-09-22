import assert from "node:assert/strict";
import test from "node:test";
import { createProductSchema, parseBrlToCents } from "../src/lib/validation/product.ts";

test("parses BRL text into integer cents without floating point math", () => {
  assert.equal(parseBrlToCents("19,90"), 1990);
  assert.equal(parseBrlToCents("19.9"), 1990);
  assert.equal(parseBrlToCents("0,05"), 5);
  assert.equal(parseBrlToCents(" 120 "), 12000);
});

test("rejects malformed or oversized prices", () => {
  assert.equal(parseBrlToCents("19,999"), null);
  assert.equal(parseBrlToCents("R$ 19,90"), null);
  assert.equal(parseBrlToCents("-1,00"), null);
  assert.equal(parseBrlToCents("1000000,00"), null);
});

test("validates and normalizes create-product input", () => {
  const result = createProductSchema.safeParse({
    name: "  Heineken 600ml  ",
    description: "  Garrafa retornável.  ",
    price: "19,90",
    categoryId: "6b50bf9c-d27a-49c8-b607-01b25cc4aa1a",
    available: true,
    featured: false,
    active: true,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.name, "Heineken 600ml");
    assert.equal(result.data.description, "Garrafa retornável.");
  }
});

test("rejects missing fields and an invalid category", () => {
  const result = createProductSchema.safeParse({
    name: "",
    description: "",
    price: "abc",
    categoryId: "another-tenant",
    available: true,
    featured: false,
    active: true,
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    assert.ok(errors.name);
    assert.ok(errors.price);
    assert.ok(errors.categoryId);
  }
});
