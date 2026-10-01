import assert from "node:assert/strict";
import test from "node:test";
import { MusicTerminal } from "../src/lib/music/terminal.ts";
const id="55000000-0000-4000-8000-000000000001";
const first={id,videoId:"aaaaaaaaaaa",title:"First",channelTitle:"Channel"},second={...first,id:id.replace(/1$/,"2"),videoId:"bbbbbbbbbbb"};
const state=(track=first,generation=1)=>({status:track?"playing":"waiting",track,leaseGeneration:1,playbackGeneration:generation,
  topic:"music-poc:opaque",leaseExpiresAt:new Date(1000000).toISOString()});
const event=(track=first,generation=1,operation="ended")=>({operation,requestId:track.id,leaseGeneration:1,playbackGeneration:generation,...(operation==="error"?{errorCode:150}:{})});
function fixture(transport){let now=0;const calls=[],views=[];
  const terminal=new MusicTerminal("relicas",id,id,async command=>{calls.push(command);return transport(command,calls.length);},v=>views.push(v),()=>now);
  return {terminal,calls,views,time:n=>{now=n;}};
}
test("INSERT wakes never interrupt playing; heartbeat has bounded frequency",async()=>{
  const f=fixture(()=>state());await f.terminal.wake();await f.terminal.wake();assert.equal(f.calls.length,1);
  f.time(10000);await f.terminal.wake();await f.terminal.tick();assert.equal(f.calls.length,1);
  f.time(20000);await f.terminal.tick();assert.equal(f.calls[1].operation,"heartbeat");assert.equal(f.terminal.view.playback.track.id,id);
  f.terminal.setReady(true);await f.terminal.tick();assert.equal(f.calls[2].ready,true);
});
test("ENDED and ERROR advance automatically; stale generations never report",async()=>{
  const f=fixture((_,n)=>n===1?state():n===2?state(second,2):state(null,3));await f.terminal.wake();
  await f.terminal.report(event(first,0));assert.equal(f.calls.length,1);
  await f.terminal.report(event());assert.equal(f.terminal.view.playback.track.id,second.id);
  await f.terminal.report(event());assert.equal(f.calls.length,2);
  await f.terminal.report(event(second,2,"error"));assert.equal(f.terminal.view.status,"waiting");assert.equal(f.terminal.view.playback.track,null);
});
test("lost response retries identical technical event, not a new claim",async()=>{
  const f=fixture((_,n)=>{if(n===2)throw Error("network");return n===1?state():state(second,2);});
  await f.terminal.wake();await f.terminal.report(event());assert.equal(f.terminal.view.status,"recovering");
  f.time(14999);await f.terminal.tick();assert.equal(f.calls.length,2);
  f.time(15000);await f.terminal.tick();assert.deepEqual(f.calls[2],f.calls[1]);assert.equal(f.terminal.view.status,"playing");
});
test("ENDED arriving during heartbeat and instruction during transport are not lost",async()=>{
  let resolve;const f=fixture((_,n)=>n===2?new Promise(r=>{resolve=r;}):n>=3?state(second,2):state());
  await f.terminal.wake();f.time(20000);const pending=f.terminal.tick();await f.terminal.report(event());resolve(state());await pending;
  assert.equal(f.calls[2].operation,"ended");assert.equal(f.terminal.view.playback.track.id,second.id);
  let finish;const other=fixture((_,n)=>n===1?new Promise(r=>{finish=r;}):state());
  const boot=other.terminal.wake();other.time(5000);await other.terminal.wake("instruction");finish(state());await boot;
  assert.equal(other.calls.length,2);assert.equal(other.calls[1].operation,"state");
});
test("local watchdog stops playback before lease expiry; late replies cannot extend it",async()=>{
  const f=fixture((_,n)=>{if(n>1)throw Error("offline");return state();});await f.terminal.wake();
  f.time(84000);await f.terminal.tick();assert.ok(f.terminal.view.playback?.track);
  f.time(85000);await f.terminal.tick();assert.equal(f.terminal.view.playback,null);assert.equal(f.terminal.view.status,"recovering");
  let resolve;const late=fixture(()=>new Promise(r=>{resolve=r;}));const boot=late.terminal.wake();late.time(86000);resolve(state());await boot;
  assert.equal(late.terminal.view.playback,null);
});
test("revoked stops permanently; disabled can recover and ordinary idle wakes are throttled",async()=>{
  const revoked=fixture(()=>({status:"unauthorized"}));await revoked.terminal.wake();revoked.time(100000);await revoked.terminal.tick();await revoked.terminal.wake();assert.equal(revoked.calls.length,1);
  const disabled=fixture((_,n)=>n===1?{status:"disabled"}:state(null));await disabled.terminal.wake();disabled.time(20000);await disabled.terminal.tick();assert.equal(disabled.terminal.view.status,"waiting");
  const waiting=fixture(()=>state(null));await waiting.terminal.wake();await waiting.terminal.wake();assert.equal(waiting.calls.length,1);
  waiting.time(5000);await waiting.terminal.wake();assert.equal(waiting.calls.length,2);waiting.terminal.dispose();await waiting.terminal.report(event());assert.equal(waiting.calls.length,2);
});
