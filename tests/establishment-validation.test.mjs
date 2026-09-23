import assert from "node:assert/strict";
import test from "node:test";
import { establishmentSettingsSchema } from "../src/lib/validation/establishment.ts";

test("normalizes optional establishment contacts", () => {
  const result = establishmentSettingsSchema.parse({ name: "Relica's", instagram: "@relicas.bar", whatsapp: "+55 (11) 99999-9999" });
  assert.deepEqual(result, { name: "Relica's", instagram: "relicas.bar", whatsapp: "5511999999999" });
});

test("rejects invalid establishment settings", () => {
  assert.equal(establishmentSettingsSchema.safeParse({ name: "R", instagram: "invalid profile", whatsapp: "123" }).success, false);
});
