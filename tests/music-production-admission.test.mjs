import assert from "node:assert/strict";
import test from "node:test";
import { requestMusic,searchMusic } from "../src/lib/music/request-workflow.ts";
import { searchMusicVideos,validateMusicVideo } from "../src/lib/music/youtube.ts";
const identity={slug:"relicas",visitorHash:"v",networkHash:"n"},id="aaaaaaaaaaa";
const video={videoId:id,title:"Server title",channelTitle:"Server channel",thumbnailUrl:null};
function deps(overrides={}) {
  const calls=[];return {calls,receipt:async()=>{calls.push("receipt");return null;},
    reserve:async(_,op)=>{calls.push(op);return {status:"reserved"};},validate:async()=>{calls.push("validate");return video;},
    search:async()=>{calls.push("search");return [video];},admit:async(...args)=>{calls.push(args);return {status:"accepted"};},...overrides};
}
test("idempotent accepted/conflicting receipts short circuit before quotas/upstream",async()=>{
  for(const status of ["accepted","retry_conflict"]){const d=deps({receipt:async()=>({status})});
    assert.equal((await requestMusic(identity,"retry",id,d)).status,status);assert.equal(d.calls.length,0);}
});
test("admission reserves quota before server validation and only admits fetched metadata",async()=>{
  const d=deps();assert.equal((await requestMusic(identity,"retry",id,d)).status,"accepted");
  assert.deepEqual(d.calls.slice(0,3),["receipt","validate","validate"]);
  assert.deepEqual(d.calls[3].slice(0,3),[identity,"retry",video]);
  assert.ok(Date.parse(d.calls[3][3])<=Date.now());
  for(const status of ["disabled","offline","full","limited","quota_exhausted"]){
    const blocked=deps({reserve:async()=>({status})});
    assert.equal((await requestMusic(identity,"retry",id,blocked)).status,status);assert.deepEqual(blocked.calls,["receipt"]);
    assert.equal((await searchMusic(identity,"song",blocked)).status,status);assert.deepEqual(blocked.calls,["receipt"]);
  }
});
test("search reserves independently before read-only upstream",async()=>{
  const d=deps();assert.deepEqual(await searchMusic(identity,"song",d),{status:"results",results:[video]});assert.deepEqual(d.calls,["search","search"]);
});
test("YouTube search uses embeddable videos, header key, no OAuth/playlist and timeout",async()=>{
  const result=await searchMusicVideos("song","secret",async(url,init)=>{
    assert.equal(url.searchParams.get("videoEmbeddable"),"true");assert.equal(url.searchParams.get("type"),"video");
    assert.equal(url.searchParams.get("key"),null);assert.equal(init.headers["X-Goog-Api-Key"],"secret");
    assert.ok(init.signal);assert.equal(init.cache,"no-store");assert.equal(url.pathname,"/youtube/v3/search");
    return Response.json({items:[{id:{videoId:id},snippet:{title:"Title",channelTitle:"Channel",thumbnails:{medium:{url:"https://evil.example/img"}}}}]});
  });assert.equal(result[0].thumbnailUrl,null);
});
test("metadata validates exact id, availability, public/processed and embedding",async()=>{
  const item={id,snippet:{title:"Title",channelTitle:"Channel"},status:{embeddable:true,privacyStatus:"public",uploadStatus:"processed"}};
  assert.equal((await validateMusicVideo(id,"key",async()=>Response.json({items:[item]}))).videoId,id);
  for(const changed of [{...item,id:"bbbbbbbbbbb"},{...item,status:{...item.status,embeddable:false}},
    {...item,status:{...item.status,privacyStatus:"private"}},{...item,status:{...item.status,uploadStatus:"rejected"}},null])
    await assert.rejects(validateMusicVideo(id,"key",async()=>Response.json({items:changed?[changed]:[]})),/video_unavailable/);
});
test("search ignores non-video and malformed items without discarding valid videos",async()=>{
 const snippet={title:"Thornhill",channelTitle:"Channel"};
 const valid={id:{kind:"youtube#video",videoId:id},snippet};
 const result=await searchMusicVideos("Thornhill","key",async()=>Response.json({items:[
  {id:{kind:"youtube#channel",channelId:"channel"},snippet},
  {id:{kind:"youtube#playlist",playlistId:"playlist"},snippet},
  {id:{videoId:"invalid"},snippet},null,{...valid,snippet:{...snippet,title:""}},valid,
 ]}));
 assert.deepEqual(result,[{videoId:id,title:"Thornhill",channelTitle:"Channel",thumbnailUrl:null}]);
 assert.deepEqual(await searchMusicVideos("song","key",async()=>Response.json({items:[{id:{channelId:"channel"},snippet}]})),[]);
 for(const body of [{},{items:null},{items:Array(51).fill(valid)}])
  await assert.rejects(searchMusicVideos("song","key",async()=>Response.json(body)),/upstream_unavailable/);
});
test("upstream failures are sanitized and cannot be admitted",async()=>{
  await assert.rejects(searchMusicVideos("song","key",async()=>{throw Error("raw sensitive response");}),/^Error: upstream_unavailable$/);
  await assert.rejects(searchMusicVideos("song","key",async()=>Response.json({error:{errors:[{reason:"quotaExceeded"}]}},{status:403})),/quota_exhausted/);
  const d=deps({validate:async()=>{throw Error("unavailable");}});
  await assert.rejects(requestMusic(identity,"retry",id,d),/unavailable/);assert.equal(d.calls.some(Array.isArray),false);
});
