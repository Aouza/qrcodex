import { NextResponse } from "next/server";
import { localPocAllowed } from "@/lib/music/runtime";
import { searchYouTubePocVideos, YouTubePocError } from "@/lib/youtube-poc/client";
import { parseSearchQuery } from "@/lib/youtube-poc/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if(!localPocAllowed())return NextResponse.json({error:"NOT_FOUND"},{status:404});
  const url = new URL(request.url);
  const parsedQuery = parseSearchQuery(url.searchParams.get("q"));

  if (!parsedQuery.ok) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchYouTubePocVideos(parsedQuery.query);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: userFacingError(error, "SEARCH_UNAVAILABLE") },
      { status: 502 },
    );
  }
}

function userFacingError(error: unknown, fallback: string) {
  if (error instanceof YouTubePocError && error.code === "MISSING_CONFIG") {
    return "POC_NOT_CONFIGURED";
  }

  return fallback;
}
