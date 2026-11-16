import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";

async function render(result) {
  const source = await readFile(new URL("../src/components/site/home-agenda.tsx",import.meta.url),"utf8");
  const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}});
  const code=outputText.replace(/from "react\/jsx-runtime"/g,`from "${import.meta.resolve("react/jsx-runtime")}"`)
    .replace(/import Link from "next\/link";/,'const Link = props => _jsx("a",props);')
    .replace(/import styles from "[^\"]+\.module\.css";/,"const styles={};");
  const {HomeAgenda}=await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  return renderToStaticMarkup(createElement(HomeAgenda,{result}));
}

test("paper Agenda renders real titles and dates in Sao Paulo, with a working full Agenda link", async()=>{
  const html=await render({status:"ready",events:[{id:"event",title:"Show cadastrado",description:null,
    starts_at:"2026-11-21T01:00:00Z",ends_at:null,image_url:"https://example.test/flyer.webp",external_url:null}]});
  assert.match(html,/Show cadastrado/);
  assert.match(html,/20\/11/);
  assert.match(html,/SEX/);
  assert.match(html,/datetime="2026-11-21T01:00:00Z"/i);
  assert.match(html,/href="\/relicas\/agenda"/);
  assert.doesNotMatch(html,/Tributo|CREED|carousel|<button|<img/);
});

test("empty and unavailable Agenda keep navigation and honest messages", async()=>{
  for(const status of ["empty","error","loading"]){
    const html=await render({status,events:[]});
    assert.match(html,/href="\/relicas\/agenda"/);
    assert.match(html,status==="empty"?/Nenhum show anunciado/:status==="error"?/Não foi possível carregar/:/Carregando/);
  }
});
