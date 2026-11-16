import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

async function loadHero() {
  const source = await readFile(new URL("../src/components/site/site-hero.tsx", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  });
  const code = outputText
    .replace(/from "react\/jsx-runtime"/g, `from "${import.meta.resolve("react/jsx-runtime")}"`)
    .replace(/import Image from "next\/image";/, 'const Image = ({src, alt}) => _jsx("img", {src, alt});')
    .replace(/import Link from "next\/link";/, 'const Link = (props) => _jsx("a", props);')
    .replace(/import styles from "[^\"]+\.module\.css";/, "const styles = {};");
  return (await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`)).SiteHero;
}

test("hero offers readable HTML and working Agenda/menu links without JS or a concept photo", async () => {
  const Hero = await loadHero();
  const html = renderToStaticMarkup(createElement(Hero, { imageSrc: null }));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(text, /Mais que um bar, uma casa do rock\./i);
  assert.match(html, /href="\/relicas\/agenda"/);
  assert.match(html, /href="\/relicas\/cardapio"/);
  assert.match(text, /Ver agenda/);
  assert.match(text, /Ver cardápio/);
  assert.doesNotMatch(html, /<img|conceitual|carousel|<button/);
  assert.doesNotMatch(text, /Zona Sul|karaokê/i);
});

test("user-supplied hero image is decorative without a concept label", async () => {
  const Hero = await loadHero();
  const html = renderToStaticMarkup(createElement(Hero, { imageSrc: "/images/hero/hero.png" }));
  assert.match(html, /src="\/images\/hero\/hero.png"/);
  assert.match(html, /alt=""/);
  assert.doesNotMatch(html, /Imagem conceitual/);
});
