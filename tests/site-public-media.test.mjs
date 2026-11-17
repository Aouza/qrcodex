import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

test("approved media and user-supplied real testimonials render in production", async () => {
  const { HomeFeatures } = await loadSiteComponent("src/components/site/home-features.tsx");
  const { HomeVisit } = await loadSiteComponent("src/components/site/home-visit.tsx");
  const { HomeTestimonials } = await loadSiteComponent("src/components/site/home-testimonials.tsx");
  const original = { node: process.env.NODE_ENV, vercel: process.env.VERCEL_ENV };
  try {
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";
    const features = renderToStaticMarkup(createElement(HomeFeatures));
    assert.match(features, /comidas-cardapio-section.png/);
    assert.match(features, /ambiente-conceitual.webp/);
    const visit = renderToStaticMarkup(createElement(HomeVisit, { reservationHref: null }));
    assert.match(visit, /vinil-decorativo.webp/);
    assert.match(visit, /mapa-ilustrativo.webp/);
    assert.match(visit, /Mapa ilustrativo/);
    const testimonials = renderToStaticMarkup(createElement(HomeTestimonials));
    assert.match(testimonials, /Gilson Amorim/);
    assert.match(testimonials, /Karol Paixão/);
    assert.match(testimonials, /Jéssica Castro/);
    assert.doesNotMatch(testimonials, /Marcos T\.|Juliana S\.|Rodrigo M\./);
  } finally {
    for (const [key, value] of [["NODE_ENV", original.node], ["VERCEL_ENV", original.vercel]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
