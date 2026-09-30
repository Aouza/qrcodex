import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { issuePlayerSession, playerKeyMatches, PLAYER_SESSION_TTL, verifyPlayerSession } from "./player-session";
import { parsePlaybackRow } from "./playback-row";

const input = z.object({
  slug: z.string().min(1).max(100),
  operation: z.enum(["state", "ended", "error"]),
  requestId: z.uuid().optional(),
  errorCode: z.union([z.literal(2), z.literal(5), z.literal(100), z.literal(101), z.literal(150), z.literal(153)]).optional(),
}).strict();

function playerDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("PLAYER_NOT_CONFIGURED");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function handlePlayerOperation(request: Request) {
  // Cookie-bearing mutations must originate from this application.
  // Next may normalize Request.url to its internal hostname. Compare Origin
  // with the browser-facing Host, retaining the proxy's external scheme.
  const url = new URL(request.url);
  const scheme = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? url.protocol.slice(0, -1);
  const origin = `${scheme}://${request.headers.get("host") ?? url.host}`;
  if (request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "PLAYER_FORBIDDEN" }, { status: 403 });
  }
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  const { slug, operation, requestId, errorCode } = parsed.data;
  if (operation !== "state" && (!requestId || (operation === "error" && errorCode === undefined))) {
    return NextResponse.json({ error: "INVALID_EVENT" }, { status: 400 });
  }
  const key = process.env.YOUTUBE_POC_PLAYER_KEY ?? "";
  const jar = await cookies();
  const tenantId = verifyPlayerSession(jar.get("youtube-poc-player")?.value, slug, key);
  if (!tenantId) return NextResponse.json({ error: "PLAYER_UNAUTHORIZED" }, { status: 401 });
  try {
    const db = playerDatabase();
    const { data: tenant, error: tenantError } = await db.from("establishments").select("id")
      .eq("id", tenantId).eq("slug", slug).eq("active", true).maybeSingle();
    if (tenantError) throw tenantError;
    if (!tenant) return NextResponse.json({ error: "PLAYER_UNAUTHORIZED" }, { status: 401 });
    const result = operation === "state"
      ? await db.rpc("claim_next_music_request", { tenant_id: tenantId }).maybeSingle()
      : await db.rpc("advance_music_player", { tenant_id: tenantId, request_id: requestId,
          playback_event: operation, error_code: errorCode ?? null }).maybeSingle();
    if (result.error) throw result.error;
    const { data: topic, error } = await db.rpc("music_player_topic", { tenant_id: tenantId });
    if (error) throw error;
    const current = parsePlaybackRow(result.data);
    // Queue history and tenant metadata are not part of the playback protocol.
    return NextResponse.json({ current, topic: z.string().min(1).parse(topic) },
      { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "PLAYER_UNAVAILABLE" }, { status: 503 });
  }
}

export async function authorizePlayer(form: FormData, slug: string): Promise<boolean> {
  const key = process.env.YOUTUBE_POC_PLAYER_KEY ?? "";
  const supplied = form.get("playerKey");
  if (typeof supplied !== "string" || !playerKeyMatches(supplied, key)) return false;
  try {
    const { data, error } = await playerDatabase().from("establishments").select("id")
      .eq("slug", slug).eq("active", true).maybeSingle();
    if (error || !data) return false;
    (await cookies()).set("youtube-poc-player", issuePlayerSession(data.id, slug, key), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: PLAYER_SESSION_TTL,
    });
    return true;
  } catch { return false; }
}

export async function hasPlayerSession(slug: string) {
  return !!verifyPlayerSession((await cookies()).get("youtube-poc-player")?.value,
    slug, process.env.YOUTUBE_POC_PLAYER_KEY ?? "");
}
