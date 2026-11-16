import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
let code=ts.transpileModule(await readFile("src/components/admin/admin-music-panel.tsx","utf8"),{
 compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
code=code.replace(/import Link from "next\/link";/,'const Link=({href,children,...props})=>element("a",{href,...props},children);')
 .replace(/import \{ useRouter \} from "next\/navigation";/,'const useRouter=()=>({refresh(){}});')
 .replace(/import \{ createClient \} from "[^"]+";/,'const createClient=()=>{throw Error("SSR must not create browser clients");};')
 .replace(/import \{ mutateAdminMusic \} from "[^"]+";/,'const mutateAdminMusic=()=>{throw Error("SSR must not mutate");};')
 .replace(/import styles from "[^"]+";/,'const styles=new Proxy({},{get:(_,key)=>String(key)});')
 .replace(/from "(react(?:\/jsx-runtime)?)"/g,(_,name)=>`from "${import.meta.resolve(name)}"`);
code=`import {createElement as element} from "${import.meta.resolve("react")}";\n${code}`;
const {AdminMusicPanel}=await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const id="56000000-0000-4000-8000-000000000021",track={id,title:"Current track",channelTitle:"Channel",requestedAt:new Date().toISOString()};
const initial={enabled:true,requestsEnabled:true,paired:true,online:true,topic:"music-poc:opaque",current:track,queue:[{...track,id:id.replace(/1$/,"2"),title:"Next track"}]};
test("admin SSR displays current/FIFO/device status and only approved operations",()=>{
 const html=renderToStaticMarkup(createElement(AdminMusicPanel,{initial,slug:"relicas"}));
 for(const text of ["Current track","Next track","online e pronta","Substituir TV","Pular música atual","Remover pedido","Salvar configuração"])assert.ok(html.includes(text));
 assert.doesNotMatch(html,/iframe|votar|reordenar|playlist|token_hash|pairingCode/i);assert.match(html,/musicas\/player/);
});
test("empty/offline defaults show waiting and prevent unavailable operations",()=>{
 const html=renderToStaticMarkup(createElement(AdminMusicPanel,{initial:{...initial,enabled:false,online:false,paired:false,current:null,queue:[]},slug:"relicas"}));
 assert.match(html,/Aguardando pedidos/);assert.match(html,/offline ou aguardando ativação/);assert.doesNotMatch(html,/Pular música atual/);
});
test("admin mobile uses wrapping, minimum action size and keyboard focus",async()=>{
 const css=await readFile("src/components/admin/admin-music.module.css","utf8");
 for(const check of [/min-width:0/,/overflow-wrap:anywhere/,/flex-wrap:wrap/,/min-height:48px/,/:focus-visible/])assert.match(css,check);
});

test("music admin uses the shared light admin palette, not public dark tokens",async()=>{
 const css=await readFile("src/components/admin/admin-music.module.css","utf8");
 assert.match(css,/\.card \{[^}]*background:#ffffff;[^}]*color:#1b1b1a;/);
 assert.match(css,/\.card p \{ color:#686865;/);
 assert.match(css,/outline:2px solid #c58b00/);
 assert.doesNotMatch(css,/var\(--color-/);
});
