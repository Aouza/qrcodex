import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
export const CONSENT_VERSION = "music-2026-09-30";
export const MUSIC_COOKIE_AGE = 30 * 24 * 3600;
export function secretReady(secret: string) { return secret.length >= 32; }
export function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function keyedDigest(secret: string, purpose: string, value: string) {
  if (!secretReady(secret)) throw new Error("MUSIC_NOT_CONFIGURED");
  return createHmac("sha256",secret).update(`${purpose}:${value}`).digest("hex");
}
export function equalSecret(actual: string, expected: string) {
  return timingSafeEqual(createHash("sha256").update(actual).digest(),createHash("sha256").update(expected).digest());
}
export function deviceCookieName(slug: string) { return `music-device-${digest(slug).slice(0,16)}`; }
export function visitorCookieName(slug: string) { return `music-visitor-${digest(slug).slice(0,16)}`; }
export function newDeviceToken() { return randomBytes(32).toString("hex"); }
export function normalizePairingCode(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 80) return null;
  const code=value.trim();
  // Temporary compatibility with outstanding ten-minute codes from older deploys.
  if (/^[a-f0-9]{64}$/.test(code)) return code;
  const short=code.toUpperCase();
  return /^[2-9A-HJ-NP-Z]{4}-?[2-9A-HJ-NP-Z]{4}$/.test(short) ? short.replace("-","") : null;
}
export function deviceDigest(token: string | undefined) { return token && /^[a-f0-9]{64}$/.test(token) ? digest(token) : null; }
export function issueDevice(token: string,slug: string,secret: string) {
  if (!deviceDigest(token)) throw new Error("INVALID_DEVICE_TOKEN");
  return `${token}.${keyedDigest(secret,"device-signature",`${slug}:${token}`)}`;
}
export function verifyDevice(value: string | undefined,slug: string,secret: string) {
  if (!value || value.length!==129 || !secretReady(secret)) return null;
  const [token,signature]=value.split(".");
  if (!deviceDigest(token) || !signature || !/^[a-f0-9]{64}$/.test(signature) ||
    !equalSecret(signature,keyedDigest(secret,"device-signature",`${slug}:${token}`))) return null;
  return deviceDigest(token); // The database still validates revocation/expiry/tenant.
}
export function issueVisitor(slug: string,secret: string,now=Date.now()) {
  const value=Buffer.from(JSON.stringify({ slug,version:CONSENT_VERSION,nonce:randomBytes(32).toString("hex"),expires:now+MUSIC_COOKIE_AGE*1000 })).toString("base64url");
  return `${value}.${keyedDigest(secret,"visitor-signature",value)}`;
}
export function verifyVisitor(token: string | undefined,slug: string,secret: string,now=Date.now()) {
  if (!token || token.length>1000 || !secretReady(secret)) return null;
  const [value,signature,...rest]=token.split(".");
  if (rest.length || !value || !signature || !/^[a-f0-9]{64}$/.test(signature) || !equalSecret(signature,keyedDigest(secret,"visitor-signature",value))) return null;
  try {
    const data=JSON.parse(Buffer.from(value,"base64url").toString());
    return data.slug===slug && data.version===CONSENT_VERSION && /^[a-f0-9]{64}$/.test(data.nonce) && Number.isFinite(data.expires) &&
      data.expires>now && data.expires<=now+MUSIC_COOKIE_AGE*1000
      ? keyedDigest(secret,"visitor",`${slug}:${data.nonce}`) : null;
  } catch { return null; }
}
export function sameMusicOrigin(headers: Headers,configured: string | undefined) {
  if (!configured) return false;
  try {
    const url=new URL(configured);
    return ["http:","https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash && url.pathname==="/" &&
      headers.get("origin")===url.origin;
  } catch { return false; }
}
export function networkIdentity(headers: Headers,env: {vercel?:string;nodeEnv?:string;localNetwork?:string}) {
  if (env.vercel === "1") {
    const raw=headers.get("x-vercel-forwarded-for")?.trim();
    if (!raw || !isIP(raw)) return null; // Never trust XFF lists or a browser's generic forwarded header.
    if (isIP(raw)===4) return raw;
    try { return new URL(`http://[${raw}]`).hostname.toLowerCase(); } catch { return null; }
  }
  // Explicit fixed development identity aggregates the LAN without trusting client headers.
  return env.nodeEnv==="development" && !env.vercel && env.localNetwork ? `local:${env.localNetwork}` : null;
}
export async function boundedJson(request: Request,maximum=4096,maximumReadMs=5000) {
  if (request.headers.get("content-type")?.toLowerCase().split(";")[0].trim()!=="application/json") return null;
  if (Number(request.headers.get("content-length"))>maximum || !request.body) return null;
  const reader=request.body.getReader(); const chunks:Uint8Array[]=[]; let bytes=0;
  let expired=false;
  const timer=setTimeout(()=>{expired=true;void reader.cancel().catch(()=>{});},maximumReadMs);
  try {
    while (true) { const part=await reader.read(); if (part.done) break;
      bytes+=part.value.byteLength; if (bytes>maximum) { await reader.cancel(); return null; } chunks.push(part.value); }
    return expired?null:JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return null; } finally { clearTimeout(timer);reader.releaseLock(); }
}
