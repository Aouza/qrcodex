import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

const { SiteHero } = await loadSiteComponent("src/components/site/site-hero.tsx");

test("approved hero offers readable HTML, reservation fallback and Agenda without JS", () => {
  const html = renderToStaticMarkup(createElement(SiteHero, { imageSrc: null }));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(text, /Mais que um bar, uma casa do rock\./i);
  assert.match(html, /href="#contato"/);
  assert.match(html, /href="\/relicas\/agenda"/);
  assert.match(text, /Ver a agenda/i);
  assert.match(text, /Reserve sua mesa/);
  assert.doesNotMatch(html, /<img|carousel|<button/);
  assert.doesNotMatch(text, /Zona Sul|karaokê/i);
});

test("review hero image is decorative and reservations use the configured contact", () => {
  const html = renderToStaticMarkup(createElement(SiteHero, { imageSrc: "/assets/site-review/hero-relicas.webp", reservationHref: "https://wa.me/5511999999999" }));
  assert.match(html, /src="\/assets\/site-review\/hero-relicas.webp"/);
  assert.match(html, /alt=""/);
  assert.match(html, /href="https:\/\/wa.me\/5511999999999"/);
  assert.match(html, /rel="noopener noreferrer"/);
});
