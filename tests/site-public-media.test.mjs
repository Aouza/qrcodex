import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

test("approved media and user-supplied real testimonials render in production", async () => {
  const { HomeFeatures } = await loadSiteComponent("src/components/site/home-features.tsx");
  const { HomeVisit } = await loadSiteComponent("src/components/site/home-visit.tsx");
  const { HomeTestimonials } = await loadSiteComponent("src/components/site/home-testimonials.tsx");
  const { HomeHighlights } = await loadSiteComponent("src/components/site/home-highlights.tsx");
  const original = { node: process.env.NODE_ENV, vercel: process.env.VERCEL_ENV };
  try {
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";
    const highlights = renderToStaticMarkup(createElement(HomeHighlights));
    assert.equal((highlights.match(/<li\b/g) ?? []).length, 4);
    for (const text of ["4,5", "776", "Preço médio", "R$ 40 – 100", "Música ao vivo", "Sextas e Sábados", "Ambiente acolhedor", "e LGBT+ friendly"]) assert.ok(highlights.includes(text));
    const features = renderToStaticMarkup(createElement(HomeFeatures));
    assert.match(features, /comidas-cardapio-section.png/);
    assert.match(features, /a-casa.png/);
    const featureText = features.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    assert.match(featureText, /Mais que um bar, um refúgio do rock\./);
    assert.match(featureText, /Um bar simples, autêntico e feito por quem vive a música\./);
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
