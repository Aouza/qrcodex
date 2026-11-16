import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { hasPlayerSession } from "@/lib/youtube-poc/player-server";
import { MusicTvPlayer } from "@/components/youtube-poc/music-tv-player";
import { initializePlayer } from "./actions";
import styles from "./player.module.css";
import { localPocAllowed,productionMusicEnabled } from "@/lib/music/runtime";
import { hasProductionDevice } from "@/lib/music/server";
import { ProductionTvPlayer } from "@/components/music/production-tv-player";
import { musicSlug } from "@/lib/music/protocol";

export const dynamic = "force-dynamic";
export const metadata = { title: "Music TV Player", robots: { index: false, follow: false } };

export default async function MusicPlayerPage({ params, searchParams }: {
  params: Promise<{ slug: string }>; searchParams: Promise<{ setup?: string }>;
}) {
  const { slug } = await params;
  const production=productionMusicEnabled();
  if(!musicSlug.safeParse(slug).success||(!production&&!localPocAllowed()))notFound();
  const { data: tenant, error } = await createPublicClient().from("establishments")
    .select("name").eq("slug", slug).eq("active", true).maybeSingle();
  if (error) throw new Error("Player temporarily unavailable.");
  if (!tenant) notFound();
  if(production) {
    if(await hasProductionDevice(slug).catch(()=>false))return <ProductionTvPlayer slug={slug} name={tenant.name}/>;
    const failed=(await searchParams).setup==="failed";
    return <main className={styles.screen}><section className={styles.center}><h1>{tenant.name}</h1>
      <form action={initializePlayer.bind(null,slug)} className={styles.setup}>
        <label htmlFor="pairingCode">Código de pareamento da TV</label>
        <input id="pairingCode" name="pairingCode" type="text" required minLength={8} maxLength={64}
          placeholder="XXXX-XXXX" autoCapitalize="characters" autoCorrect="off" spellCheck={false} autoComplete="off"/>
        <p>Digite os 8 caracteres gerados no admin. O hífen é opcional.</p>
        <label><input type="checkbox" name="consent" required/> Li e aceito a <a href={`/${slug}/musicas/privacidade`}>política de privacidade</a> e os <a href="https://www.youtube.com/t/terms">Termos do YouTube</a>.</label>
        <button type="submit">Parear TV</button>
        {failed&&<p role="alert">Código inválido, expirado ou limite de tentativas. Gere um código no admin e verifique a configuração.</p>}
      </form></section></main>;
  }
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
