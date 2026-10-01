import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { readFile } from "node:fs/promises";
import { issueDevice,issueVisitor,visitorCookieName,deviceCookieName } from "../src/lib/music/security.ts";
const origin="http://127.0.0.1:3116",secret="fixture-session-secret-".repeat(3),cron="fixture-cron-secret-".repeat(3);
const id="55000000-0000-4000-8000-000000000001";
const disabled=process.argv.includes("--disabled");
const server=spawn(process.execPath,["--import","./tests/fixtures/music-server-fixture.mjs","node_modules/next/dist/bin/next","start","-p","3116","-H","127.0.0.1"],{
  stdio:["ignore","pipe","pipe"],env:{...process.env,NODE_ENV:"production",VERCEL:"1",MUSIC_PRODUCTION_ENABLED:disabled?"false":"true",
    MUSIC_APP_ORIGIN:origin,MUSIC_SESSION_SECRET:secret,CRON_SECRET:cron,SUPABASE_SERVICE_ROLE_KEY:"fixture-service-only",
    YOUTUBE_MUSIC_API_KEY:"fixture-video-key",YOUTUBE_MUSIC_SEARCH_COST:"1",YOUTUBE_MUSIC_VIDEO_COST:"1"}});
let logs="";for(const stream of [server.stdout,server.stderr])stream.on("data",chunk=>{logs=(logs+chunk).slice(-5000);});
const headers={"content-type":"application/json",origin,"x-vercel-forwarded-for":"192.0.2.7"};
const visitor=`${visitorCookieName("relicas")}=${issueVisitor("relicas",secret)}`;
const device=`${deviceCookieName("relicas")}=${issueDevice("d".repeat(64),"relicas",secret)}`;
const state={slug:"relicas",instanceId:id,bootId:id,operation:"state"};
async function post(path,body,extra={},raw=false){return fetch(origin+path,{method:"POST",headers:{...headers,...extra},
  body:raw?body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});}
function htmlDecode(s){return s.replaceAll("&quot;",'"').replaceAll("&#x27;","'").replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">");}
try{
  let ready=false;for(let i=0;i<80;i++){if(server.exitCode!==null)throw Error("Fixture server exited");
    try{await fetch(origin+"/api/music/cleanup",{signal:AbortSignal.timeout(1000)});ready=true;break;}catch{await delay(200);}}
  assert.ok(ready,"Built server ready");
  if(disabled){
    for(const route of ["player","public"])assert.equal((await post(`/api/music/${route}`,state)).status,503);
    assert.equal((await fetch(origin+"/api/music/cleanup",{headers:{authorization:`Bearer ${cron}`}})).status,503);
    for(const route of ["musicas","musicas/player","musicas/privacidade"]){
      const html=await (await fetch(origin+`/relicas/${route}`)).text();assert.match(html,/404/);assert.doesNotMatch(html,/pairingCode|id="music-search"/);
    }
    assert.equal((await post("/api/youtube/poc/player",state)).status,404);
    console.log("HTTP PASS: production feature OFF fails closed; hosted POC cannot reopen the boundary.");
  }else{
  assert.equal((await post("/api/music/player",state)).status,401);
  assert.equal((await post("/api/music/player",state,{origin:"https://evil.example"})).status,403);
  assert.equal((await post("/api/music/player","broken",{},true)).status,400);
  assert.equal((await post("/api/music/player",{...state,status:"playing"})).status,400);
  assert.equal((await post("/api/music/player","x".repeat(5000),{},true)).status,400);
  const forged=await post("/api/music/player",state,{cookie:`${visitor}; ${deviceCookieName("relicas")}=${"e".repeat(64)}`});
  assert.equal(forged.status,401);assert.match(forged.headers.get("set-cookie"),/Expires=Thu, 01 Jan 1970/);
  const unknown=await post("/api/music/player",state,{cookie:`${visitor}; ${deviceCookieName("relicas")}=${issueDevice("e".repeat(64),"relicas",secret)}`});
  assert.equal(unknown.status,401,"Signed token is still checked against authoritative device state");
  const authorized=await post("/api/music/player",state,{cookie:`${visitor}; ${device}`});
  assert.equal(authorized.status,200);const initial=await authorized.json();assert.equal(initial.track.id,id);
  assert.match(authorized.headers.get("cache-control"),/no-store/);
  const advanced=await post("/api/music/player",{...state,operation:"ended",requestId:id,leaseGeneration:1,playbackGeneration:1},{cookie:`${visitor}; ${device}`});
  assert.equal((await advanced.json()).track.id,id.replace(/1$/,"2"));
  const finished=await post("/api/music/player",{...state,operation:"error",requestId:id.replace(/1$/,"2"),leaseGeneration:1,playbackGeneration:2,errorCode:150},{cookie:`${visitor}; ${device}`});
  assert.equal((await finished.json()).status,"waiting");
  assert.equal((await post("/api/music/public",{operation:"search",slug:"relicas",query:"song"})).status,401);
  assert.equal((await post("/api/music/public",{operation:"search",slug:"relicas",query:"song"},{"x-vercel-forwarded-for":"bad"})).status,503);
  const consent=await post("/api/music/public",{operation:"consent",slug:"relicas",accepted:true});assert.equal(consent.status,200);
  const cookie=consent.headers.getSetCookie()[0];for(const flag of [/HttpOnly/i,/Secure/i,/SameSite=strict/i])assert.match(cookie,flag);
  const repeated=await post("/api/music/public",{operation:"consent",slug:"relicas",accepted:true},{cookie:visitor});
  assert.equal(repeated.headers.getSetCookie().length,0,"Repeat consent preserves identity");
  const search=await post("/api/music/public",{operation:"search",slug:"relicas",query:"song"},{cookie:visitor});
  assert.equal(search.status,200);assert.equal((await search.json()).results[0].videoId,"aaaaaaaaaaa");
  const request={operation:"request",slug:"relicas",videoId:"aaaaaaaaaaa",retryId:id};
  assert.equal((await post("/api/music/public",{...request,title:"Forged"},{cookie:visitor})).status,400);
  for(let i=0;i<2;i++){const accepted=await post("/api/music/public",request,{cookie:visitor});assert.equal(accepted.status,200);assert.equal((await accepted.json()).status,"accepted");}
  assert.equal((await fetch(origin+"/api/music/cleanup")).status,401);
  const cleaned=await fetch(origin+"/api/music/cleanup",{headers:{authorization:`Bearer ${cron}`}});assert.equal(cleaned.status,200);
  assert.deepEqual(await cleaned.json(),{removedRequests:0});
  for(const path of ["player","request","queue/request"])
    assert.equal((await post(`/api/youtube/poc/${path}`,state)).status,404);
  for(const path of ["search","oauth/start","oauth/callback"])
    assert.equal((await fetch(origin+`/api/youtube/poc/${path}`)).status,404);
  const retired=await fetch(origin+"/relicas/musicas/poc");
  // App Router may stream the not-found boundary under an already-sent 200.
  const retiredHtml=await retired.text();assert.match(retiredHtml,/404/);assert.doesNotMatch(retiredHtml,/youtube-poc__intro/);
  const page=await fetch(origin+"/relicas/musicas");assert.equal(page.status,200);
  const publicHtml=await page.text();assert.match(publicHtml,/privacidade/);assert.match(publicHtml,/consent/i);
  const setup=await fetch(origin+"/relicas/musicas/player");assert.equal(setup.status,200);const html=await setup.text();assert.match(html,/pairingCode/);
  const form=new FormData();for(const input of html.matchAll(/<input\b[^>]*>/g)){
    const name=input[0].match(/\bname="([^"]+)"/),value=input[0].match(/\bvalue="([^"]*)"/);
    if(name?.[1].startsWith("$ACTION"))form.append(htmlDecode(name[1]),htmlDecode(value?.[1]??""));
  }
  assert.ok([...form.keys()].length,"Native server action fields found");form.set("pairingCode","c".repeat(64));form.set("consent","on");
  const paired=await fetch(origin+"/relicas/musicas/player",{method:"POST",headers:{origin,"x-vercel-forwarded-for":"192.0.2.7"},body:form,redirect:"manual"});
  assert.equal(paired.status,303);assert.ok(paired.headers.getSetCookie().some(v=>v.startsWith(deviceCookieName("relicas")+"=")));
  for(const value of paired.headers.getSetCookie())assert.match(value,/HttpOnly/);
  const tv=await fetch(origin+"/relicas/musicas/player",{headers:{cookie:`${visitor}; ${device}`}});assert.equal(tv.status,200);
  const tvHtml=await tv.text();assert.doesNotMatch(tvHtml,/pairingCode/);assert.match(tvHtml,/Iniciando player/);
  for(const rendered of [html,publicHtml,tvHtml])for(const key of [secret,cron,"fixture-service-only","fixture-video-key"])assert.equal(rendered.includes(key),false);
  const config=JSON.parse(await readFile("vercel.json","utf8"));assert.deepEqual(config.crons,[]);
  console.log("HTTP PASS: isolated built-server consent/search/request/pairing/cookies/player/lifecycle/cleanup, SSR and hosted POC closure; zero remote calls.");
  }
}catch(error){console.error("Music HTTP fixture failed:",error.stack);console.error(logs);process.exitCode=1;}
finally{server.kill();await Promise.race([new Promise(resolve=>server.once("exit",resolve)),delay(2000)]);}
