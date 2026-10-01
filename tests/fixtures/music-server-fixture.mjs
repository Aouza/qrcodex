// Preload ONLY for the local built-server smoke. All outbound fetches are mocked:
// no real Supabase/Google host, credentials, quota or queue is touched.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const digest=v=>createHash("sha256").update(v).digest("hex");
const authorized=new Set([digest("d".repeat(64))]);
const first="55000000-0000-4000-8000-000000000001",second=first.replace(/1$/,"2");
let current=first,generation=1;const receipts=new Map();
const playback=()=>({status:current?"playing":"waiting",leaseGeneration:1,playbackGeneration:generation,
  leaseExpiresAt:new Date(Date.now()+90000).toISOString(),topic:"music-poc:fixture-opaque",
  track:current?{id:current,videoId:current===first?"aaaaaaaaaaa":"bbbbbbbbbbb",title:"Fixture track",channelTitle:"Fixture channel"}:null});
globalThis.fetch=async(input,init={})=>{
  const url=new URL(typeof input==="string"?input:input instanceof URL?input:input.url);
  if(url.pathname==="/rest/v1/establishments")return Response.json({name:"Fixture Bar"});
  if(url.pathname.startsWith("/rest/v1/rpc/")){
    const fn=url.pathname.split("/").at(-1),args=JSON.parse(init.body??"{}");
    if(fn==="music_availability")return Response.json({enabled:true,accepting:true});
    assert.equal(new Headers(init.headers).get("apikey"),"fixture-service-only");
    if(fn==="music_redeem_pair"){
      assert.equal(args.p_code_hash,digest("c".repeat(64)));assert.match(args.p_token_hash,/^[a-f0-9]{64}$/);
      assert.match(args.p_network_hash,/^[a-f0-9]{64}$/);authorized.add(args.p_token_hash);
      return Response.json({status:"authorized",tenantId:first});
    }
    if(fn.startsWith("music_player_")){
      // Exactly one deliberately signed-but-unknown fixture token is allowed
      // through to prove DB validation. Any other bogus raw cookie must be
      // rejected before RPC dispatch by the application signature check.
      if(!authorized.has(args.p_token_hash)){
        assert.equal(args.p_token_hash,digest("e".repeat(64)));
        return Response.json({status:"unauthorized"});
      }
      if(fn==="music_player_event"&&args.p_request===current&&args.p_playback_generation===generation){
        current=current===first?second:null;generation++;
      }
      return Response.json(playback());
    }
    if(fn==="music_request_receipt")return Response.json(receipts.get(args.p_retry)??null);
    if(fn==="music_reserve_api")return Response.json({status:"reserved"});
    if(fn==="music_admit_request"){
      assert.equal(args.p_title,"Server metadata");assert.equal(args.p_channel,"Server channel");
      assert.ok(Date.parse(args.p_verified_at)<=Date.now());assert.match(args.p_visitor_hash,/^[a-f0-9]{64}$/);
      const accepted={status:"accepted",requestId:first};receipts.set(args.p_retry,accepted);return Response.json(accepted);
    }
    if(fn==="music_cleanup")return Response.json({removedRequests:0});
    throw Error(`Unexpected fixture RPC: ${fn}`);
  }
  if(url.origin==="https://www.googleapis.com"){
    assert.equal(new Headers(init.headers).get("x-goog-api-key"),"fixture-video-key");assert.equal(url.searchParams.has("key"),false);
    if(url.pathname.endsWith("search"))return Response.json({items:[{id:{videoId:"aaaaaaaaaaa"},snippet:{title:"Search metadata",channelTitle:"Search channel"}}]});
    return Response.json({items:[{id:url.searchParams.get("id"),snippet:{title:"Server metadata",channelTitle:"Server channel"},
      status:{embeddable:true,privacyStatus:"public",uploadStatus:"processed"}}]});
  }
  throw Error("Outbound fetch blocked by isolated Music fixture");
};
