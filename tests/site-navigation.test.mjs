import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

test("a navegação pública oferece os mesmos destinos no desktop e no celular", async () => {
  const source = await readFile(new URL("../src/components/site/site-header.tsx", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  });
  const code = outputText
    .replace(/from "react\/jsx-runtime"/g, `from "${import.meta.resolve("react/jsx-runtime")}"`)
    .replace(/import Image from "next\/image";/, 'const Image = () => null;')
    .replace(/import Link from "next\/link";/, 'const Link = (props) => _jsx("a", props);')
    .replace(/import styles from "[^"]+\.module\.css";/, "const styles = {};");
  const { SiteHeader } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  const reservationHref = "https://wa.me/5511987654321?text=Reserva";
  const html = renderToStaticMarkup(createElement(SiteHeader, { reservationHref }));
  const navigations = [...html.matchAll(/<nav\b[^>]*>(.*?)<\/nav>/gs)];

  assert.equal(navigations.length, 2);
  for (const [, nav] of navigations) {
    assert.match(nav, /href="\/"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/"/);
    assert.match(nav, /href="\/relicas\/agenda"[^>]*>Agenda<\/a>/);
    assert.match(nav, /href="\/relicas\/cardapio"[^>]*>Cardápio<\/a>/);
    assert.deepEqual(
      [...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(([, label]) => label),
      ["Início", "Agenda", "Cardápio", "A Casa", "Galeria", "Contato"],
    );
    for (const id of ["a-casa", "galeria", "contato"]) {
      assert.ok(nav.includes(`href="#${id}"`));
    }
  }
  assert.match(html, /<details\b[^>]*><summary\b[^>]*>Menu<\/summary><nav\b/);
  assert.equal(html.split(`href="${reservationHref}"`).length - 1, 2);
  assert.equal(html.split("Reserve sua mesa").length - 1, 2);
  const fallback = renderToStaticMarkup(createElement(SiteHeader));
  assert.equal(fallback.split("Reserve sua mesa").length - 1, 2);
  assert.equal(fallback.split('href="#contato"').length - 1, 4);
});
