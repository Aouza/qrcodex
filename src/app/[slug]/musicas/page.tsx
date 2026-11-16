import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { musicAvailability } from "@/lib/music/database";
import { productionMusicEnabled } from "@/lib/music/runtime";
import { musicSlug } from "@/lib/music/protocol";
import { verifyVisitor,visitorCookieName } from "@/lib/music/security";
import { MusicRequestForm } from "@/components/music/music-request-form";
import styles from "./music.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"Música",robots:{index:false,follow:false}};
export default async function MusicPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!productionMusicEnabled()||!musicSlug.safeParse(slug).success)notFound();
  const {data:tenant,error}=await createPublicClient().from("establishments").select("name").eq("slug",slug).eq("active",true).maybeSingle();
  if(error)return <main className={styles.page}><p>Música temporariamente indisponível.</p><Link href={`/${slug}`}>Voltar ao Hub</Link></main>;
  if(!tenant)notFound();
  const availability=await musicAvailability(slug).catch(()=>null);
  const consented=!!verifyVisitor((await cookies()).get(visitorCookieName(slug))?.value,slug,process.env.MUSIC_SESSION_SECRET??"");
  return <main className={styles.page}><header><Link href={`/${slug}`}>Voltar ao Hub</Link><p>{tenant.name}</p><h1>Que som você quer ouvir?</h1></header>
    {availability?.enabled?<MusicRequestForm slug={slug} consented={consented} accepting={availability.accepting}/>:<p>{availability?"Música desativada neste estabelecimento.":"Música temporariamente indisponível."}</p>}
  </main>;
}
