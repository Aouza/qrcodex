import assert from "node:assert/strict";
import test from "node:test";
import { resolveMembership } from "../src/lib/auth/resolve-membership.ts";

const membership = { establishmentId: "tenant-a", role: "owner" };

test("fails closed when no establishment membership exists", () => {
  assert.deepEqual(resolveMembership([]), { status: "none" });
});

test("resolves the only establishment membership", () => {
  assert.deepEqual(resolveMembership([membership]), {
    status: "single",
    membership,
  });
});

test("requires future selection when multiple memberships exist", () => {
  assert.deepEqual(resolveMembership([
    membership,
    { establishmentId: "tenant-b", role: "owner" },
  ]), { status: "multiple" });
});
