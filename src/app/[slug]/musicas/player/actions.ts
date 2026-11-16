"use server";
import { redirect } from "next/navigation";
import { authorizePlayer } from "@/lib/youtube-poc/player-server";
import { localPocAllowed,productionMusicEnabled } from "@/lib/music/runtime";
import { authorizeMusicDevice } from "@/lib/music/server";

export async function initializePlayer(slug: string, form: FormData) {
  const authorized = productionMusicEnabled()?await authorizeMusicDevice(slug,form):localPocAllowed()?await authorizePlayer(form,slug):false;
  redirect(`/${encodeURIComponent(slug)}/musicas/player${authorized ? "" : "?setup=failed"}`);
}
