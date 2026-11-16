import { NextResponse } from "next/server";
import { localPocAllowed } from "@/lib/music/runtime";
import { createMusicQueueRequest } from "@/lib/youtube-poc/music-queue";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if(!localPocAllowed())return NextResponse.json({error:"NOT_FOUND"},{status:404});
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const body = payload as { slug?: unknown; request?: unknown };
  if (!body || typeof body !== "object" || typeof body.slug !== "string") {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const result = await createMusicQueueRequest({ slug: body.slug, payload: body.request });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ status: "QUEUED", request: result.request });
}
