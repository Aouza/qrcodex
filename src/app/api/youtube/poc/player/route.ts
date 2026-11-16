import { handlePlayerOperation } from "@/lib/youtube-poc/player-server";
import { NextResponse } from "next/server";
import { localPocAllowed } from "@/lib/music/runtime";

export const dynamic = "force-dynamic";
export async function POST(request:Request) {
  if(!localPocAllowed())return NextResponse.json({error:"NOT_FOUND"},{status:404});
  return handlePlayerOperation(request);
}
