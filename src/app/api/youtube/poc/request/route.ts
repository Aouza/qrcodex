import { NextResponse } from "next/server";
import { insertYouTubePocPlaylistItem, YouTubePocError } from "@/lib/youtube-poc/client";
import { parseVideoRequestInput } from "@/lib/youtube-poc/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const parsedPayload = parseVideoRequestInput(payload);
  if (!parsedPayload.ok) {
    return NextResponse.json({ error: parsedPayload.error }, { status: 400 });
  }

  try {
    await insertYouTubePocPlaylistItem(parsedPayload.videoId);
    return NextResponse.json({ status: "ADDED" });
  } catch (error) {
    if (error instanceof YouTubePocError && error.code === "VIDEO_ALREADY_IN_PLAYLIST") {
      return NextResponse.json({ status: "ALREADY_IN_PLAYLIST" });
    }

    if (error instanceof YouTubePocError && error.code === "MISSING_CONFIG") {
      return NextResponse.json({ error: "POC_NOT_CONFIGURED" }, { status: 503 });
    }

    return NextResponse.json({ error: "REQUEST_FAILED" }, { status: 502 });
  }
}
