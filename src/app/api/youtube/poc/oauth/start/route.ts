import { NextResponse } from "next/server";
import { localPocAllowed } from "@/lib/music/runtime";
import { getYouTubePocOAuthStartUrl, YouTubePocOAuthBootstrapError } from "@/lib/youtube-poc/oauth-bootstrap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if(!localPocAllowed())return NextResponse.json({error:"NOT_FOUND"},{status:404});
  try {
    return NextResponse.redirect(getYouTubePocOAuthStartUrl());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof YouTubePocOAuthBootstrapError ? error.code : "OAUTH_START_FAILED" },
      { status: 503 },
    );
  }
}
