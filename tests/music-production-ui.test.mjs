import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
// Lightweight SSR checks; actual 320px/device playback acceptance is TASK-058.
const source=await readFile("src/components/music/music-request-form.tsx","utf8");
let compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
compiled=compiled.replace(/import Link from "next\/link";/,'const Link=({href,children,...props})=>element("a",{href,...props},children);')
  .replace(/import styles from "[^"]+\.css";/,'const styles=new Proxy({},{get:(_,key)=>String(key)});')
  .replace(/from "(react(?:\/jsx-runtime)?)"/g,(_,name)=>`from "${import.meta.resolve(name)}"`);
compiled=`import {createElement as element} from "${import.meta.resolve("react")}";\n${compiled}`;
const {MusicRequestForm}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const render=props=>renderToStaticMarkup(createElement(MusicRequestForm,{slug:"relicas",...props}));
test("before consent there is no search or request UI; explicit privacy and YouTube terms",()=>{
  const html=render({consented:false,accepting:true});
  assert.match(html,/type="checkbox"/);assert.match(html,/disabled=""/);assert.match(html,/musicas\/privacidade/);
  assert.match(html,/youtube.com\/t\/terms/);assert.match(html,/policies.google.com\/privacy/);
  assert.doesNotMatch(html,/id="music-search"/);assert.doesNotMatch(html,/Pedir música/);
});
test("consented customer only sees search/request, no TV or queue/admin controls",()=>{
  const html=render({consented:true,accepting:true});assert.match(html,/id="music-search"/);assert.match(html,/Pedir música/);
  assert.match(html,/aria-label="Pedidos de música"/);assert.doesNotMatch(html,/Pular|Parear|Remover|iframe|admin/i);
});
test("offline/paused admission is explicit without blocking access to privacy",()=>{
  const html=render({consented:true,accepting:false});assert.match(html,/TV está offline/);assert.match(html,/Privacidade/);
  assert.match(html,/<input[^>]*id="music-search"[^>]*disabled=""/);
  assert.match(html,/<button[^>]*disabled=""[^>]*type="submit"/);
  assert.match(html,/<button[^>]*disabled=""[^>]*>Pedir música/);
  assert.match(html,/Atualize esta tela/);
});
test("mobile styles use wrapping, bounded widths, keyboard focus and 48px actions",async()=>{
  const css=await readFile("src/app/[slug]/musicas/music.module.css","utf8");
  for(const rule of [/max-width:720px/,/min-width:0/,/overflow-wrap:anywhere/,/min-height:48px/,/:focus-visible/])assert.match(css,rule);
  assert.doesNotMatch(css,/min-width:\s*(?:[4-9]\d\d|\d{4,})px/);
});
