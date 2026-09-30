import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { hasPlayerSession } from "@/lib/youtube-poc/player-server";
import { MusicTvPlayer } from "@/components/youtube-poc/music-tv-player";
import { initializePlayer } from "./actions";
import styles from "./player.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Music TV Player", robots: { index: false, follow: false } };

export default async function MusicPlayerPage({ params, searchParams }: {
  params: Promise<{ slug: string }>; searchParams: Promise<{ setup?: string }>;
}) {
  const { slug } = await params;
  const { data: tenant, error } = await createPublicClient().from("establishments")
    .select("name").eq("slug", slug).eq("active", true).maybeSingle();
  if (error) throw new Error("Player temporarily unavailable.");
  if (!tenant) notFound();
  if (await hasPlayerSession(slug)) return <MusicTvPlayer slug={slug} name={tenant.name} />;
  const failed = (await searchParams).setup === "failed";
  return <main className={styles.screen}>
    <section className={styles.center}>
      <h1>{tenant.name}</h1>
      <form action={initializePlayer.bind(null, slug)} className={styles.setup}>
        <label htmlFor="playerKey">Chave do player experimental</label>
        <input id="playerKey" name="playerKey" type="password" required autoComplete="off" />
        <button type="submit">Autorizar player</button>
        {failed && <p role="alert">Não foi possível autorizar o player. Verifique a chave e a configuração.</p>}
      </form>
    </section>
  </main>;
}
