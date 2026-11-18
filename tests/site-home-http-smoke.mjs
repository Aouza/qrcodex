import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { getSiteWeekRange } from "../src/lib/site/week-range.ts";

const directory = mkdtempSync(join(tmpdir(),"relicas-site-smoke-"));
const statePath = join(directory,"state.json");
const tenant = "55000000-0000-4000-8000-000000000001";
const event = { id: tenant, establishment_id: tenant, active: true, title: "Fixture show initial",
  description: null, starts_at: new Date().toISOString(), ends_at: new Date(Date.now()+3600000).toISOString(),
  image_url: "https://fixture.invalid/flyer.webp", external_url: null };
const save = state => writeFileSync(statePath,JSON.stringify(state));
save({events:[event]});
const origin = "http://127.0.0.1:3118";
const server = spawn(process.execPath,["--import","./tests/fixtures/site-home-server.mjs","node_modules/next/dist/bin/next","start","-p","3118","-H","127.0.0.1"],{
  windowsHide: true, stdio:["ignore","pipe","pipe"],
  env:{...process.env,NODE_ENV:"production",SITE_HOME_FIXTURE_STATE:statePath,
    VERCEL_ENV:process.env.VERCEL_ENV ?? "production",
    NEXT_PUBLIC_SUPABASE_URL:"https://fixture.invalid",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"fixture-public-key"},
});
let startupLogs = "";
for (const stream of [server.stdout, server.stderr]) stream.on("data", chunk => {
  startupLogs = (startupLogs + chunk.toString()).slice(-3000);
});
const html = async path => {
  const response = await fetch(origin+path,{signal:AbortSignal.timeout(10000)});
  assert.equal(response.status,200);
  return response.text();
};
try {
  let ready=false;
  for(let i=0;i<60;i++){
    if(server.exitCode!==null) throw Error(`Isolated server exited: ${startupLogs}`);
    try{await fetch(origin+"/images/agenda-paper.webp",{signal:AbortSignal.timeout(1000)});ready=true;break;}catch{await delay(250);}
  }
  assert(ready,`Built server ready: ${startupLogs}`);
  let page = await html("/");
  assert.match(page,/Fixture show initial/);
  assert.match(page,/Drinks &amp;.*petiscos/);
  assert.match(page,/id="localizacao"/);
  assert.doesNotMatch(page,/agenda-paper\.webp|id="galeria"/);
  assert.match(page,/Shows da/);
  for (const asset of ["hero-relicas.png", "microfone-agenda.png", "comidas-cardapio-section.png", "a-casa.png", "vinil-decorativo.webp", "mapa-ilustrativo.webp"]) assert.match(page, new RegExp(`<img[^>]*${asset}`));
  for (const author of ["Gilson Amorim", "Karol Paixão", "Jéssica Castro"]) assert.ok(page.includes(author));
  assert.doesNotMatch(page, /Marcos T\.|Juliana S\.|Rodrigo M\.|há 8 meses|há 1 ano|há 3 meses/);
  assert(page.indexOf('id="a-casa-titulo"') < page.indexOf('id="depoimentos-titulo"'));
  assert.match(page,/\/relicas\/agenda/);
  assert.doesNotMatch(page,/Prévia de layout/);
  assert.match(page,/Informações da casa/);
  assert.match(page,/Preço médio/);
  assert(page.indexOf('id="inicio-titulo"') < page.indexOf('aria-label="Informações da casa"'));
  assert(page.indexOf('aria-label="Informações da casa"') < page.indexOf('id="agenda"'));
  assert.match(await html("/relicas/agenda"),/Fixture show initial/);
  save({events:[event,{...event,id:"55000000-0000-4000-8000-000000000002",title:"Fixture second show"},{...event,id:"55000000-0000-4000-8000-000000000003",title:"Fixture third show"}]});
  page=await html("/");assert.match(page,/Fixture second show/);assert.doesNotMatch(page,/Fixture third show/);
  assert.match(await html("/relicas/agenda"),/Fixture third show/);
  const nextWeek = getSiteWeekRange(new Date()).before;
  save({events:[{...event,title:"Fixture next week",starts_at:nextWeek,ends_at:null}]});
  page=await html("/");assert.match(page,/Nenhum show anunciado para esta semana/);assert.doesNotMatch(page,/Fixture next week/);
  assert.match(await html("/relicas/agenda"),/Fixture next week/);
  save({events:[{...event,active:false}]});
  page=await html("/");assert.match(page,/Nenhum show anunciado/);assert.doesNotMatch(page,/Fixture show initial/);
  save({events:[{...event,title:"Fixture show published"}]});
  assert.match(await html("/"),/Fixture show published/);
  save({events:[{...event,image_url:null}]});
  assert.match(await html("/"),/Nenhum show anunciado/);
  save({events:[]});assert.match(await html("/"),/Nenhum show anunciado/);
  save({events:[{...event,establishment_id:"other"}]});assert.doesNotMatch(await html("/"),/Fixture show initial/);
  save({events:[],fail:true});page=await html("/");assert.match(page,/Não foi possível carregar/);assert.match(page,/id="inicio-titulo"/);
  console.log("HTTP PASS: real build/start home and legacy Agenda; fresh reads after publish/unpublish/media removal/delete, tenant isolation and independent failure. All outbound fetches mocked; no real database writes. Existing open tabs do not auto-refresh.");
} finally {
  server.kill();
}
