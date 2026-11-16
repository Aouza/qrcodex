import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test, { afterEach, beforeEach } from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: "data:text/javascript,export{}", shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
const { resolveSiteContext, resolveSiteContextFromHeaders } = await import("../src/lib/site/public-context.ts");
const originalHosts = process.env.SITE_ALLOWED_HOSTS;
beforeEach(() => { process.env.SITE_ALLOWED_HOSTS = "bar.example,preview.example,localhost:3000,127.0.0.1:3000,[::1]:3000"; });
afterEach(() => {
  if (originalHosts === undefined) delete process.env.SITE_ALLOWED_HOSTS;
  else process.env.SITE_ALLOWED_HOSTS = originalHosts;
});

test("explicit approved hosts resolve only the fixed Relica's public context", () => {
  assert.deepEqual(resolveSiteContext("BAR.EXAMPLE"), { slug: "relicas", mode: "site", host: "bar.example" });
  assert.deepEqual(resolveSiteContext("preview.example"), { slug: "relicas", mode: "site", host: "preview.example" });
});

test("local authorities normalize case while retaining explicitly approved ports", () => {
  for (const host of ["LOCALHOST:3000", "127.0.0.1:3000", "[::1]:3000"]) {
    assert.equal(resolveSiteContext(host)?.host, host.toLowerCase());
  }
  assert.equal(resolveSiteContext("localhost:3001"), null);
  assert.equal(resolveSiteContext("localhost"), null);
});

test("unknown, absent and malformed Host values never resolve a tenant", () => {
  for (const host of [null, undefined, "", "unknown.example", " bar.example", "bar.example ", "bar.example\n", "bar.example\r",
    "bar.example.evil.example", "bar.example,unknown.example", "https://bar.example", "bar.example/path",
    "bar.example?tenant=relicas", "bar.example#fragment", "user@bar.example", "bar.example\\evil",
    "bar.example\r\nX-Test: yes", "bar..example", "-bar.example", "bar-.example", "bar.example.",
    "*.example", "bar%2eexample", "localhost:0", "localhost:65536", "localhost:003000", "localhost:abc",
    "bar.example:3000", "[::1]:65536"]) {
    assert.equal(resolveSiteContext(host), null, `Rejected Host: ${JSON.stringify(host)}`);
  }
});

test("a missing, empty or malformed server allowlist fails closed", () => {
  for (const value of [undefined, "", "   ", "*.example", "https://bar.example", "bar.example,*.vercel.app"]) {
    if (value === undefined) delete process.env.SITE_ALLOWED_HOSTS;
    else process.env.SITE_ALLOWED_HOSTS = value;
    assert.equal(resolveSiteContext("bar.example"), null);
  }
});

test("operator whitespace, case and duplicate entries are normalized without accepting a suffix match", () => {
  process.env.SITE_ALLOWED_HOSTS = " BAR.EXAMPLE ,bar.example, LOCALHOST:3000 ";
  assert.equal(resolveSiteContext("bar.example")?.slug, "relicas");
  assert.equal(resolveSiteContext("localhost:3000")?.slug, "relicas");
  assert.equal(resolveSiteContext("evil-bar.example"), null);
});

test("Vercel deployments have no universal or implicit allowlist fallback", () => {
  assert.equal(resolveSiteContext("arbitrary.vercel.app"), null);
  process.env.SITE_ALLOWED_HOSTS = "approved.vercel.app";
  assert.equal(resolveSiteContext("approved.vercel.app")?.slug, "relicas");
  assert.equal(resolveSiteContext("arbitrary.vercel.app"), null);
});

test("only the request Host is considered; forwarded or browser tenant claims cannot select context", () => {
  const forged = new Headers({ host: "unknown.example", "x-forwarded-host": "bar.example", "x-site-tenant": "relicas" });
  assert.equal(resolveSiteContextFromHeaders(forged), null);
  assert.equal(resolveSiteContextFromHeaders(new Headers({ "x-forwarded-host": "bar.example" })), null);
  assert.equal(resolveSiteContextFromHeaders(new Headers({ host: "bar.example", "x-forwarded-host": "evil.example" }))?.slug, "relicas");
});
