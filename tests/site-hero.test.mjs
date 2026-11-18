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
  assert.match(text, /Relica’s Rock Bar/);
  assert.match(text, /O ponto de encontro do rock na zona sul de São Paulo\./i);
  assert.match(text, /Shows ao vivo, cerveja gelada, petiscos e uma galera que vive o rock de verdade\./);
  assert.match(html, /href="#contato"/);
  assert.match(html, /href="\/relicas\/agenda"/);
  assert.match(text, /Ver a agenda/i);
  assert.match(text, /Reserve sua mesa/);
  assert.doesNotMatch(html, /<img|carousel|<button/);
  assert.doesNotMatch(text, /karaokê/i);
});

test("selected hero image is decorative and reservations use the configured contact", () => {
  const html = renderToStaticMarkup(createElement(SiteHero, { imageSrc: "/images/hero/hero-relicas.png", reservationHref: "https://wa.me/5511999999999" }));
  assert.match(html, /src="\/images\/hero\/hero-relicas.png"/);
  assert.match(html, /alt=""/);
  assert.match(html, /href="https:\/\/wa.me\/5511999999999"/);
  assert.match(html, /rel="noopener noreferrer"/);
});
