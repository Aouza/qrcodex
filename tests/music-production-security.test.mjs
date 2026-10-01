import assert from "node:assert/strict";
import test from "node:test";
import { boundedJson,deviceCookieName,deviceDigest,digest,equalSecret,issueDevice,issueVisitor,keyedDigest,
  MUSIC_COOKIE_AGE,networkIdentity,newDeviceToken,sameMusicOrigin,verifyDevice,verifyVisitor,visitorCookieName } from "../src/lib/music/security.ts";
import { publicInput,playerInput,playbackSchema } from "../src/lib/music/protocol.ts";
const secret="s".repeat(40),slug="relicas",now=1700000000000;
const id="55000000-0000-4000-8000-000000000001";
test("visitor consent is signed, tenant/version/expiry bound and invalidated on key rotation",()=>{
  const token=issueVisitor(slug,secret,now),identity=verifyVisitor(token,slug,secret,now);
  assert.match(identity,/^[a-f0-9]{64}$/);
  assert.equal(verifyVisitor(token,slug,secret,now+1000),identity);
  for(const [value,tenant,key,time] of [[token,"other",secret,now],[token,slug,"x".repeat(40),now],
    [token,slug,secret,now+MUSIC_COOKIE_AGE*1000],[token+".extra",slug,secret,now],["x".repeat(1001),slug,secret,now]])
    assert.equal(verifyVisitor(value,tenant,key,time),null);
  const payload=JSON.parse(Buffer.from(token.split(".")[0],"base64url"));payload.version="old";
  const value=Buffer.from(JSON.stringify(payload)).toString("base64url");
  assert.equal(verifyVisitor(`${value}.${keyedDigest(secret,"visitor-signature",value)}`,slug,secret,now),null);
  assert.notEqual(issueVisitor(slug,secret,now),token);
});
test("random device tokens are hashed; cookies and purposes are scoped",()=>{
  const token=newDeviceToken();assert.match(token,/^[a-f0-9]{64}$/);
  assert.equal(deviceDigest(token),digest(token));assert.notEqual(deviceDigest(token),token);
  assert.equal(deviceDigest("forged"),null);
  assert.notEqual(deviceCookieName(slug),deviceCookieName("other"));
  assert.notEqual(deviceCookieName(slug),visitorCookieName(slug));
  assert.notEqual(keyedDigest(secret,"network","x"),keyedDigest(secret,"visitor","x"));
  assert.equal(equalSecret("same","same"),true);assert.equal(equalSecret("short","longer"),false);
});
test("device signatures reject tampering/tenant replay/key rotation before DB dispatch",()=>{
  const raw=newDeviceToken(),cookie=issueDevice(raw,slug,secret);
  assert.equal(verifyDevice(cookie,slug,secret),digest(raw));
  for(const [value,tenant,key] of [[raw,slug,secret],[cookie,"other",secret],[cookie,slug,"x".repeat(40)],
    [cookie.slice(0,-1)+(cookie.endsWith("0")?"1":"0"),slug,secret],[cookie+".extra",slug,secret]])
    assert.equal(verifyDevice(value,tenant,key),null);
});
test("CSRF uses configured origin, not spoofable Host; network headers fail closed",()=>{
  const h=new Headers({origin:"https://music.example",host:"evil.example"});
  assert.equal(sameMusicOrigin(h,"https://music.example"),true);
  for(const origin of [undefined,"https://evil.example","https://music.example/path","https://user@music.example"])
    assert.equal(sameMusicOrigin(h,origin),false);
  assert.equal(sameMusicOrigin(new Headers({host:"music.example"}),"https://music.example"),false);
  assert.equal(networkIdentity(new Headers({"x-forwarded-for":"1.2.3.4"}),{vercel:"1"}),null);
  assert.equal(networkIdentity(new Headers({"x-vercel-forwarded-for":"1.2.3.4, 5.6.7.8"}),{vercel:"1"}),null);
  assert.equal(networkIdentity(new Headers({"x-vercel-forwarded-for":"1.2.3.4"}),{vercel:"1"}),"1.2.3.4");
  assert.equal(networkIdentity(new Headers({"x-vercel-forwarded-for":"2001:0db8::1"}),{vercel:"1"}),"[2001:db8::1]");
  assert.equal(networkIdentity(h,{nodeEnv:"production",localNetwork:"lan"}),null);
  assert.equal(networkIdentity(h,{nodeEnv:"development",localNetwork:"lan"}),"local:lan");
});
test("bounded JSON rejects content-type, malformed and oversized bodies even without length",async()=>{
  const req=(body,type="application/json")=>new Request("http://localhost",{method:"POST",headers:{"content-type":type},body});
  assert.deepEqual(await boundedJson(req('{"ok":true}')),{ok:true});
  for(const r of [req("broken"),req("{}","text/plain"),req(JSON.stringify("x".repeat(5000)))])assert.equal(await boundedJson(r),null);
});
test("stalled JSON streams are cancelled within the server read deadline",async()=>{
  let cancelled=false;
  const stream=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{'));},cancel(){cancelled=true;}});
  const request=new Request("http://localhost",{method:"POST",headers:{"content-type":"application/json"},body:stream,duplex:"half"});
  assert.equal(await boundedJson(request,4096,10),null);assert.equal(cancelled,true);
  assert.equal(await boundedJson(new Request("http://localhost",{method:"POST",headers:{"content-type":"application/jsonjunk"},body:"{}"})),null);
});
test("public protocol rejects metadata/mutations and player protocol fences events",()=>{
  const request={slug,operation:"request",videoId:"aaaaaaaaaaa",retryId:id};
  assert.equal(publicInput.safeParse(request).success,true);
  for(const extra of [{title:"forged"},{status:"playing"},{establishment_id:id}])assert.equal(publicInput.safeParse({...request,...extra}).success,false);
  assert.equal(publicInput.safeParse({slug,operation:"search",query:"ab"}).success,false);
  const event={slug,instanceId:id,bootId:id,operation:"ended",requestId:id,leaseGeneration:1,playbackGeneration:2};
  assert.equal(playerInput.safeParse(event).success,true);
  for(const extra of [{leaseGeneration:-1},{playbackGeneration:0.5},{requestId:"wrong"},{videoId:"aaaaaaaaaaa"}])
    assert.equal(playerInput.safeParse({...event,...extra}).success,false);
  assert.equal(playerInput.safeParse({...event,operation:"error",errorCode:999}).success,false);
  assert.equal(playbackSchema.safeParse({status:"waiting",leaseGeneration:1,playbackGeneration:2,
    leaseExpiresAt:"2026-09-30T12:00:00+00:00",topic:"music-poc:opaque",track:null}).success,true);
});
