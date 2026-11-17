import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

test("approved navigation has matching desktop/mobile destinations and reservation fallback", async () => {
  const { SiteHeader } = await loadSiteComponent("src/components/site/site-header.tsx");
  const reservationHref = "https://wa.me/5511987654321?text=Reserva";
  const html = renderToStaticMarkup(createElement(SiteHeader, { reservationHref }));
  const navigations = [...html.matchAll(/<nav\b[^>]*>(.*?)<\/nav>/gs)];
  assert.equal(navigations.length, 2);
  for (const [, nav] of navigations) {
    assert.match(nav, /href="\/"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/"/);
    assert.match(nav, /href="\/relicas\/agenda"[^>]*>Agenda<\/a>/);
    assert.match(nav, /href="\/relicas\/cardapio"[^>]*>Cardápio<\/a>/);
    assert.deepEqual([...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(([, label]) => label), ["Início", "Agenda", "Cardápio", "A Casa", "Localização", "Contato"]);
    for (const id of ["a-casa", "localizacao", "contato"]) assert.ok(nav.includes(`href="#${id}"`));
  }
  assert.match(html, /<details\b[^>]*><summary\b[^>]*>Menu<\/summary><nav\b/);
  assert.equal(html.split(`href="${reservationHref}"`).length - 1, 2);
  assert.equal(html.split("Reserve sua mesa").length - 1, 2);
  const fallback = renderToStaticMarkup(createElement(SiteHeader));
  assert.equal(fallback.split("Reserve sua mesa").length - 1, 2);
  assert.equal(fallback.split('href="#contato"').length - 1, 4);
});
