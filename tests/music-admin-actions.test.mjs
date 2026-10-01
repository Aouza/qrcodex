import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { adminMusicCommand,adminRpcInstruction,adminMusicSnapshot } from "../src/lib/music/admin-protocol.ts";
const tenant="56000000-0000-4000-8000-000000000011",request="56000000-0000-4000-8000-000000000021";
let compiled=ts.transpileModule(await readFile("src/app/admin/(protected)/music/actions.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
compiled=compiled.replace(/import \{ revalidatePath \} from "[^"]+";/,'const revalidatePath=()=>{};')
 .replace(/import \{ getAdminAccess \} from "[^"]+";/,'const getAdminAccess=()=>globalThis.musicAdminTest.access();')
 .replace(/import \{ createClient \} from "[^"]+";/,'const createClient=()=>globalThis.musicAdminTest.client();')
 .replace(/import \{ productionMusicEnabled \} from "[^"]+";/,'const productionMusicEnabled=()=>globalThis.musicAdminTest.enabled;')
 .replace('"@/lib/music/admin-protocol"',JSON.stringify(import.meta.resolve("../src/lib/music/admin-protocol.ts")));
const {mutateAdminMusic}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
function fixture({status="authorized",enabled=true,data=true,error=null}={}){
 const calls=[];let checks=0;
 globalThis.musicAdminTest={enabled,access:async()=>{checks++;return {status,establishment:{id:tenant,slug:"relicas"}};},
  client:async()=>({rpc:async(name,args)=>{calls.push({name,args});return {data,error};}})};
 return {calls,checks:()=>checks};
}
test("every admin operation independently resolves membership and only calls fixed RPCs",async()=>{
 const f=fixture();const commands=[{operation:"settings",enabled:true,requestsEnabled:false},
  {operation:"skip",requestId:request,confirmed:true},{operation:"remove",requestId:request,confirmed:true},{operation:"revoke",confirmed:true}];
 for(const c of commands){assert.ok((await mutateAdminMusic(c)).message);assert.deepEqual(f.calls.at(-1),adminRpcInstruction(tenant,c));}
 assert.equal(f.checks(),commands.length);
});
test("unauthenticated, zero/multiple membership and feature OFF make no RPC calls",async()=>{
 for(const status of ["unauthenticated","not_configured","selection_required","unavailable"]){const f=fixture({status});
  assert.ok((await mutateAdminMusic({operation:"pair",replace:false})).error);assert.equal(f.calls.length,0);}
 const f=fixture({enabled:false});assert.ok((await mutateAdminMusic({operation:"revoke",confirmed:true})).error);assert.equal(f.calls.length,0);
});
test("forged tenant, generic status mutation, unconfirmed and malformed requests rejected",async()=>{
 const f=fixture();for(const command of [{operation:"pair",replace:false,tenant},{operation:"update",status:"played"},
  {operation:"revoke",confirmed:false},{operation:"remove",requestId:"forged",confirmed:true}]){
  assert.equal(adminMusicCommand.safeParse(command).success,false);assert.ok((await mutateAdminMusic(command)).error);}
 assert.equal(f.calls.length,0);
});
test("pair code is returned once in action state, replacement explicit; raw failures sanitized",async()=>{
 const f=fixture({data:"c".repeat(64)});const result=await mutateAdminMusic({operation:"pair",replace:true});
 assert.equal(result.pairingCode,"c".repeat(64));assert.deepEqual(f.calls[0].args,{p_tenant:tenant,p_replace:true});
 fixture({error:{message:"raw secret details"}});const failed=await mutateAdminMusic({operation:"pair",replace:false});
 assert.ok(failed.error);assert.equal(JSON.stringify(failed).includes("raw secret"),false);assert.equal(failed.pairingCode,undefined);
});
test("stale skip/remove acknowledged safely, snapshot cannot serialize secret fields",async()=>{
 for(const operation of ["skip","remove"]){fixture({data:false});assert.match((await mutateAdminMusic({operation,requestId:request,confirmed:true})).error,/fila mudou/);}
 const snapshot={enabled:false,requestsEnabled:false,online:false,paired:false,topic:"music-poc:opaque",current:null,queue:[]};
 assert.equal(adminMusicSnapshot.safeParse(snapshot).success,true);
 assert.equal(adminMusicSnapshot.safeParse({...snapshot,token_hash:"secret"}).success,false);
});
