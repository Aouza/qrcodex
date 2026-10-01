import "server-only";
import { cookies,headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { productionMusicEnabled } from "./runtime";
import { boundedJson,deviceCookieName,digest,equalSecret,issueDevice,issueVisitor,keyedDigest,MUSIC_COOKIE_AGE,
  networkIdentity,newDeviceToken,sameMusicOrigin,secretReady,verifyDevice,verifyVisitor,visitorCookieName } from "./security";
import { musicSlug,playbackSchema,playerInput,publicInput } from "./protocol";
import { musicAvailability,musicRpc,requestDependencies } from "./database";
import { requestMusic,searchMusic } from "./request-workflow";
import { MusicUpstreamError } from "./youtube";
export function musicResponse(data:unknown,status=200) {
  return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store, private","Vary":"Cookie","X-Content-Type-Options":"nosniff"}});
}
function configuredOrigin() {
  return process.env.MUSIC_APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
}
function sessionSecret() {
  const value=process.env.MUSIC_SESSION_SECRET??"";
  if (!secretReady(value)) throw new Error("MUSIC_NOT_CONFIGURED");
  return value;
}
function networkHash(h:Headers,secret:string) {
  const value=networkIdentity(h,{vercel:process.env.VERCEL,nodeEnv:process.env.NODE_ENV,localNetwork:process.env.MUSIC_LOCAL_NETWORK_ID});
  if (!value) throw new Error("MUSIC_NETWORK_UNAVAILABLE");
  return keyedDigest(secret,"network",value);
}
function cookieOptions() {
  return {httpOnly:true,secure:process.env.NODE_ENV==="production"||!!process.env.VERCEL,sameSite:"strict" as const,path:"/",maxAge:MUSIC_COOKIE_AGE};
}
export async function handleMusicPublic(request:Request) {
  if (!productionMusicEnabled()) return musicResponse({status:"disabled"},503);
  if (!sameMusicOrigin(request.headers,configuredOrigin())) return musicResponse({status:"forbidden"},403);
  const parsed=publicInput.safeParse(await boundedJson(request));
  if (!parsed.success) return musicResponse({status:"invalid_payload"},400);
  try {
    const input=parsed.data,secret=sessionSecret(),jar=await cookies();
    const network=networkHash(request.headers,secret);
    if (input.operation==="consent") {
      const availability=await musicAvailability(input.slug);
      if (!availability?.enabled) return musicResponse({status:"disabled"},409);
      // Preserve an existing signed visitor identity: repeat consent cannot reset limits.
      if (!verifyVisitor(jar.get(visitorCookieName(input.slug))?.value,input.slug,secret))
        jar.set(visitorCookieName(input.slug),issueVisitor(input.slug,secret),cookieOptions());
      return musicResponse({status:"consented"});
    }
    const visitor=verifyVisitor(jar.get(visitorCookieName(input.slug))?.value,input.slug,secret);
    if (!visitor) return musicResponse({status:"consent_required"},401);
    const identity={slug:input.slug,visitorHash:visitor,networkHash:network},deps=requestDependencies();
    const result=input.operation==="search" ? await searchMusic(identity,input.query,deps) : await requestMusic(identity,input.retryId,input.videoId,deps);
    return musicResponse(result,result.status==="limited"?429:["accepted","results"].includes(result.status)?200:409);
  } catch(error) {
    return error instanceof MusicUpstreamError ? musicResponse({status:error.code},error.code==="video_unavailable"?422:503)
      : musicResponse({status:"temporarily_unavailable"},503);
  }
}
export async function hasProductionDevice(slug:string) {
  const jar=await cookies();
  const secret=sessionSecret();
  return !!verifyDevice(jar.get(deviceCookieName(slug))?.value,slug,secret) && !!verifyVisitor(jar.get(visitorCookieName(slug))?.value,slug,secret);
}
export async function authorizeMusicDevice(slug:string,form:FormData) {
  if (!productionMusicEnabled() || !musicSlug.safeParse(slug).success || !sameMusicOrigin(new Headers(await headers()),configuredOrigin())) return false;
  const code=form.get("pairingCode");
  if (typeof code!=="string"||!/^[a-f0-9]{64}$/.test(code.trim())||form.get("consent")!=="on") return false;
  try {
    const secret=sessionSecret(),network=networkHash(new Headers(await headers()),secret),token=newDeviceToken();
    const reply=z.object({status:z.string()}).parse(await musicRpc("music_redeem_pair",{p_slug:slug,p_code_hash:digest(code.trim()),p_token_hash:digest(token),p_network_hash:network}));
    if (reply.status!=="authorized") return false;
    const jar=await cookies();
    jar.set(deviceCookieName(slug),issueDevice(token,slug,secret),cookieOptions());
    jar.set(visitorCookieName(slug),issueVisitor(slug,secret),cookieOptions());
    return true;
  } catch { return false; }
}
export async function handleMusicPlayer(request:Request) {
  if (!productionMusicEnabled()) return musicResponse({status:"disabled"},503);
  if (!sameMusicOrigin(request.headers,configuredOrigin())) return musicResponse({status:"forbidden"},403);
  const parsed=playerInput.safeParse(await boundedJson(request));
  if (!parsed.success) return musicResponse({status:"invalid_payload"},400);
  try {
    const input=parsed.data,jar=await cookies(),hash=verifyDevice(jar.get(deviceCookieName(input.slug))?.value,input.slug,sessionSecret());
    if (!hash || !verifyVisitor(jar.get(visitorCookieName(input.slug))?.value,input.slug,sessionSecret())) {
      jar.delete(deviceCookieName(input.slug));return musicResponse({status:"unauthorized"},401);
    }
    const args:Record<string,unknown>={p_slug:input.slug,p_token_hash:hash,p_instance:input.instanceId};
    let fn:string;
    if (input.operation==="state") { fn="music_player_state";args.p_boot=input.bootId; }
    else if (input.operation==="heartbeat") { fn="music_player_heartbeat";args.p_lease_generation=input.leaseGeneration;args.p_ready=input.ready; }
    else { fn="music_player_event";args.p_lease_generation=input.leaseGeneration;args.p_playback_generation=input.playbackGeneration;
      args.p_request=input.requestId;args.p_event=input.operation;args.p_error=input.operation==="error"?input.errorCode:null; }
    const data=await musicRpc(fn,args);
    const stop=z.object({status:z.enum(["unauthorized","disabled","busy","lease_lost"])}).safeParse(data);
    if (stop.success) { if(stop.data.status==="unauthorized")jar.delete(deviceCookieName(input.slug));
      return musicResponse(stop.data,stop.data.status==="unauthorized"?401:200); }
    const reply=playbackSchema.parse(data);
    if ((reply.status==="playing")!==!!reply.track) throw new Error("INVALID_STATE");
    return musicResponse(reply);
  } catch { return musicResponse({status:"temporarily_unavailable"},503); }
}
export async function handleMusicCleanup(request:Request) {
  const key=process.env.CRON_SECRET??"";
  if (!secretReady(key)||!equalSecret(request.headers.get("authorization")??"",`Bearer ${key}`)) return musicResponse({status:"forbidden"},401);
  if (!productionMusicEnabled()) return musicResponse({status:"disabled"},503);
  try { const result=z.object({removedRequests:z.number().int().nonnegative()}).parse(await musicRpc("music_cleanup")); return musicResponse(result); }
  catch { return musicResponse({status:"temporarily_unavailable"},503); }
}
