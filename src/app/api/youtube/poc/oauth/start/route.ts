import { NextResponse } from "next/server";
import { getYouTubePocOAuthStartUrl, YouTubePocOAuthBootstrapError } from "@/lib/youtube-poc/oauth-bootstrap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.redirect(getYouTubePocOAuthStartUrl());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof YouTubePocOAuthBootstrapError ? error.code : "OAUTH_START_FAILED" },
      { status: 503 },
    );
  }
}
