import { loadAdminMusic } from "@/lib/music/admin-server";
import { AdminMusicPanel } from "@/components/admin/admin-music-panel";
import styles from "@/components/admin/admin-content.module.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Música | Administração", robots: { index: false, follow: false } };

export default async function AdminMusicPage() {
  const data = await loadAdminMusic();
  if (!data) return null;
  return <>
    <header className={styles.heading}><p className={styles.eyebrow}>Música</p><h1>Música</h1>
      <p>Gerencie a fila e a autorização da TV. Pedidos não garantem reprodução.</p></header>
    {data.available ? <AdminMusicPanel initial={data.snapshot} slug={data.slug} /> :
      <section className={styles.pending}><strong>Música indisponível neste ambiente</strong>
        <p>A configuração e as migrações compatíveis precisam ser verificadas antes da ativação. Cardápio e Agenda continuam independentes.</p></section>}
  </>;
}
