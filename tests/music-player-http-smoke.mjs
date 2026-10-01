import assert from "node:assert/strict";
// Historical POC only: local next dev, production Music disabled. Published
// endpoints are now intentionally closed; use music-production-http-smoke.mjs.
const origin = process.env.PLAYER_SMOKE_ORIGIN ?? "http://127.0.0.1:3100";
async function post(body, headers = {}, raw = false) {
  return fetch(`${origin}/api/youtube/poc/player`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin, ...headers },
    body: raw ? body : JSON.stringify(body), signal: AbortSignal.timeout(10000),
  });
}
assert.equal((await post({ slug: "relicas", operation: "state" })).status, 401);
assert.equal((await post({ slug: "relicas", operation: "state" }, { Origin: "https://other.example" })).status, 403);
assert.equal((await post("broken-json", {}, true)).status, 400);
assert.equal((await post({ slug: "relicas", operation: "ended", requestId: "not-a-uuid" })).status, 400);
assert.equal((await post({ slug: "relicas", operation: "error", requestId: "11111111-1111-4111-8111-111111111111", errorCode: 999 })).status, 400);
assert.equal((await post({ slug: "relicas", operation: "state" }, { Cookie: "youtube-poc-player=invalid.signature" })).status, 401);
assert.equal((await post({ slug: "relicas", operation: "state", establishment_id: "client-controlled" })).status, 400);
for (const route of ["claim", "played", "failed", "state"]) {
  const response = await fetch(`${origin}/api/youtube/poc/player/${route}`, { method: "POST", signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 404);
}
console.log("HTTP PASS: unauthenticated/forged session, cross-origin, malformed events, forbidden fields and retired mutation routes.");
