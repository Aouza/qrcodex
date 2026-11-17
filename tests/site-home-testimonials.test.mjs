import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

const { HomeTestimonials } = await loadSiteComponent("src/components/site/home-testimonials.tsx");

test("user-supplied real testimonials render in every environment without dates or sample authors", () => {
  const original = { node: process.env.NODE_ENV, vercel: process.env.VERCEL_ENV };
  try {
    for (const [node, vercel] of [["development", undefined], ["production", "preview"], ["production", "production"], ["production", undefined]]) {
      process.env.NODE_ENV = node;
      if (vercel === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = vercel;
      const html = renderToStaticMarkup(createElement(HomeTestimonials));
      assert.equal((html.match(/<blockquote/g) ?? []).length, 3);
      for (const name of ["Gilson Amorim", "Karol Paixão", "Jéssica Castro"]) assert.ok(html.includes(name));
      assert.match(html, /Quem vem,/);
      assert.match(html, /faz parte\./);
      assert.match(html, /4,5 no Google/);
      assert.match(html, /776 avaliações/);
      assert.match(html, /Bebida e comida com preços bons, sem absurdos e alguns dias tem caipirinha em dobro\./);
      assert.match(html, /LGBT\+ friendly!/);
      assert.doesNotMatch(html, /Marcos T\.|Juliana S\.|Rodrigo M\.|ilustrativos|há [0-9]|meses|ano|<time|application\/ld\+json/);
      assert.doesNotMatch(html, /<a\b/);
    }
  } finally {
    for (const [key, value] of [["NODE_ENV", original.node], ["VERCEL_ENV", original.vercel]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("reviews CTA only appears with a confirmed destination", () => {
  const html = renderToStaticMarkup(createElement(HomeTestimonials, { reviewsHref: "https://maps.app.goo.gl/reviewFixture" }));
  assert.match(html, /href="https:\/\/maps.app.goo.gl\/reviewFixture"/);
  assert.match(html, /Ver avaliações/);
  assert.match(html, /rel="noopener noreferrer"/);
});
