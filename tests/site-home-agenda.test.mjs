import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";
const { HomeAgenda } = await loadSiteComponent("src/components/site/home-agenda.tsx");
const render = (result, props = {}) => renderToStaticMarkup(createElement(HomeAgenda, { result, ...props }));

test("approved Agenda rows render real title/date/time in Sao Paulo without inferred labels", () => {
  const html = render({ status: "ready", events: [{ id: "event", title: "Show cadastrado", description: null,
    starts_at: "2026-11-21T01:00:00Z", ends_at: null, image_url: "https://example.test/flyer.webp", external_url: null }] });
  assert.match(html, /Show cadastrado/);
  assert.match(html, />20</);
  assert.match(html, /NOV/);
  assert.match(html, /22h/);
  assert.match(html, /SEX/);
  assert.match(html, /datetime="2026-11-21T01:00:00Z"/i);
  assert.match(html, /href="\/relicas\/agenda"/);
  assert.match(html, /src="https:\/\/example.test\/flyer.webp"/);
  assert.doesNotMatch(html, /Tributo|CREED|carousel|<button|Reservar mesa/);
});

test("empty and unavailable Agenda keep navigation and honest messages", () => {
  for (const status of ["empty", "error", "loading"]) {
    const html = render({ status, events: [] });
    assert.match(html, /href="\/relicas\/agenda"/);
    assert.match(html, status === "empty" ? /Nenhum show anunciado/ : status === "error" ? /Não foi possível carregar/ : /Carregando/);
  }
});

test("an event can contact the configured reservation destination without inventing a ticket URL", () => {
  const html = render({ status: "ready", events: [{ id: "event", title: 'Show <long> & amigos', description: null,
    starts_at: "2026-11-21T01:00:00Z", ends_at: null, image_url: "https://example.test/flyer.webp", external_url: null }] }, { reservationHref: "https://wa.me/5511999999999" });
  assert.match(html, /href="https:\/\/wa.me\/5511999999999"/);
  assert.match(html, /aria-label="Reservar mesa para Show &lt;long&gt; &amp; amigos"/);
});
