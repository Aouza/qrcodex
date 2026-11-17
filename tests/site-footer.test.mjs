import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSiteComponent } from "./fixtures/site-components.mjs";

const { SiteFooter } = await loadSiteComponent("src/components/site/site-footer.tsx");
test("reservation fallback explains unavailable WhatsApp even when Instagram exists", () => {
  const html = renderToStaticMarkup(createElement(SiteFooter, { reservationHref: null, instagramHref: "https://instagram.com/review_fixture" }));
  assert.match(html, /WhatsApp para reservas ainda não disponível/);
  assert.match(html, /href="https:\/\/instagram.com\/review_fixture"/);
  assert.doesNotMatch(html, /facebook\.com|youtube\.com|spotify\.com/);
});
