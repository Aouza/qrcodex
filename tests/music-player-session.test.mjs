import assert from "node:assert/strict";
import test from "node:test";
import { issuePlayerSession, playerKeyMatches, verifyPlayerSession } from "../src/lib/youtube-poc/player-session.ts";
const key = "test-only-player-key-32-characters-minimum";
const tenant = "11111111-1111-4111-8111-111111111111";

test("player session is signed, tenant-scoped, expiring and revoked by key rotation", () => {
  const token = issuePlayerSession(tenant, "relicas", key, 1000);
  assert.equal(verifyPlayerSession(token, "relicas", key, 2000), tenant);
  assert.equal(verifyPlayerSession(token, "other", key, 2000), null);
  assert.equal(verifyPlayerSession(token, "relicas", key, 1000 + 12 * 3600000), null);
  assert.equal(verifyPlayerSession(token, "relicas", key + "rotated", 2000), null);
  assert.equal(token.includes(key), false);
  assert.equal(verifyPlayerSession("x" + token, "relicas", key, 2000), null);
});
test("malformed cookies and setup credentials fail closed", () => {
  for (const value of [undefined, "", "bad", "a.b.c", "a." + "é".repeat(43), "x".repeat(3000)]) {
    assert.equal(verifyPlayerSession(value, "relicas", key), null);
  }
  assert.equal(playerKeyMatches(key, key), true);
  assert.equal(playerKeyMatches("wrong", key), false);
  assert.equal(playerKeyMatches("short", "short"), false);
});
