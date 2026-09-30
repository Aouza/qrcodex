"use server";
import { redirect } from "next/navigation";
import { authorizePlayer } from "@/lib/youtube-poc/player-server";

export async function initializePlayer(slug: string, form: FormData) {
  const authorized = await authorizePlayer(form, slug);
  redirect(`/${encodeURIComponent(slug)}/musicas/player${authorized ? "" : "?setup=failed"}`);
}
