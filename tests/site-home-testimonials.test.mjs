import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

test("illustrative testimonials are identified in development/Preview and absent in production", async () => {
  const { HomeTestimonials } = await loadSiteComponent("src/components/site/home-testimonials.tsx");
  const original = { node: process.env.NODE_ENV, vercel: process.env.VERCEL_ENV };
  try {
    for (const [node, vercel, visible] of [
      ["development", undefined, true],
      ["production", "preview", true],
      ["production", "production", false],
      ["production", undefined, false],
    ]) {
      process.env.NODE_ENV = node;
      if (vercel === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = vercel;
      const html = renderToStaticMarkup(createElement(HomeTestimonials));
      if (!visible) { assert.equal(html, ""); continue; }
      assert.match(html, /Depoimentos ilustrativos/);
      assert.equal((html.match(/<blockquote/g) ?? []).length, 3);
      for (const name of ["Marcos T.", "Juliana S.", "Rodrigo M."]) assert.ok(html.includes(name));
      assert.match(html, /A galera diz/);
      assert.doesNotMatch(html, /estrelas|â˜…/);
      assert.doesNotMatch(html, /application\/ld\+json|<script|<button/);
    }
  } finally {
    for (const [key, value] of [["NODE_ENV", original.node], ["VERCEL_ENV", original.vercel]]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

