import assert from "node:assert/strict";
import test from "node:test";
import { getPublicPaths } from "../src/lib/site/public-paths.ts";

test("the institutional home stays at root with clean menu and Agenda destinations", () => {
  assert.deepEqual(getPublicPaths({ slug: "relicas", mode: "site" }), { home: "/", menu: "/cardapio", agenda: "/agenda" });
});

test("slug navigation preserves existing Relica's and other-tenant destinations", () => {
  for (const slug of ["relicas", "other-bar", "another_bar"]) {
    assert.deepEqual(getPublicPaths({ slug, mode: "slug" }), { home: `/${slug}`, menu: `/${slug}/cardapio`, agenda: `/${slug}/agenda` });
  }
});

test("navigation encodes a single slug segment without interpreting query or fragment characters", () => {
  const slug = "bar?x=1#nome";
  assert.deepEqual(getPublicPaths({ slug, mode: "slug" }), {
    home: "/bar%3Fx%3D1%23nome", menu: "/bar%3Fx%3D1%23nome/cardapio", agenda: "/bar%3Fx%3D1%23nome/agenda",
  });
  assert.equal(getPublicPaths({ slug: "São Paulo", mode: "slug" }).home, "/S%C3%A3o%20Paulo");
});

test("site mode cannot silently resolve another tenant to Relica's root", () => {
  assert.throws(() => getPublicPaths({ slug: "other-bar", mode: "site" }));
});

test("malformed navigation contexts do not create redirects or traversal paths", () => {
  for (const slug of ["", ".", "..", "//evil.example", "a/b", "a\\b", "a\nb", null]) {
    assert.throws(() => getPublicPaths({ slug, mode: "slug" }));
  }
  assert.throws(() => getPublicPaths({ slug: "relicas", mode: "forged" }));
});
