import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const directory = mkdtempSync(join(tmpdir(),"relicas-site-smoke-"));
const statePath = join(directory,"state.json");
const tenant = "55000000-0000-4000-8000-000000000001";
const event = { id: tenant, establishment_id: tenant, active: true, title: "Fixture show initial",
  description: null, starts_at: new Date(Date.now()+86400000).toISOString(), ends_at: null,
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
  assert.match(page,/Próximos/);
  assert.match(page,/\/relicas\/agenda/);
  if (process.env.VERCEL_ENV === "preview") {
    assert.match(page,/Depoimentos ilustrativos/);
    assert.match(page,/Marcos T\./);
    assert.match(page,/hero-relicas.webp/);
    assert.match(page,/Prévia de layout/);
    assert(page.indexOf('id="a-casa-titulo"') < page.indexOf('id="depoimentos-titulo"'));
  } else {
    assert.doesNotMatch(page,/Depoimentos ilustrativos|Marcos T\./);
    // Ignore Next's serialized module metadata: actual concept image markup must be absent.
    assert.doesNotMatch(page,/<img[^>]*(?:site-review|hero-relicas)/);
  }
  assert.match(await html("/relicas/agenda"),/Fixture show initial/);
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
