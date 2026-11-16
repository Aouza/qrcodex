import { createHmac, timingSafeEqual } from "node:crypto";

const TTL = 60 * 60 * 12;
export const PLAYER_SESSION_TTL = TTL;

function signature(value: string, key: string) {
  return createHmac("sha256", key).update(`music-player:${value}`).digest("base64url");
}

export function playerKeyMatches(input: string, key: string) {
  if (key.length < 32 || input.length > 512) return false;
  const left = createHmac("sha256", key).update(input).digest();
  const right = createHmac("sha256", key).update(key).digest();
  return timingSafeEqual(left, right);
}

export function issuePlayerSession(tenantId: string, slug: string, key: string, now = Date.now()) {
  const value = Buffer.from(JSON.stringify({ tenantId, slug, expires: now + TTL * 1000 })).toString("base64url");
  return `${value}.${signature(value, key)}`;
}

export function verifyPlayerSession(token: string | undefined, slug: string, key: string, now = Date.now()): string | null {
  if (!token || token.length > 2048 || key.length < 32) return null;
  const [value, supplied, extra] = token.split(".");
  if (!value || !supplied || extra) return null;
  const expected = signature(value, key);
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);
  if (suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) return null;
  try {
    const session = JSON.parse(Buffer.from(value, "base64url").toString());
    return session.slug === slug && typeof session.tenantId === "string" && /^[0-9a-f-]{36}$/i.test(session.tenantId) &&
      Number.isFinite(session.expires) && session.expires > now ? session.tenantId : null;
  } catch { return null; }
}
