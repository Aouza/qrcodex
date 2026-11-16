import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { loadSiteContacts } from "@/lib/site/load-site-contacts";
import { getReservationHref } from "@/lib/site/reservation-link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Relica’s Rock Bar",
  description: "Confira a agenda e explore o cardápio do Relica’s Rock Bar.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const contacts = await loadSiteContacts();
  const reservationHref = getReservationHref(contacts?.whatsapp);
  const instagram = contacts?.instagram;
  const instagramHref = instagram && /^[a-zA-Z0-9._]{1,30}$/.test(instagram)
    ? `https://instagram.com/${instagram}`
    : null;

  return (
    <div className={styles.site}>
      <SiteHeader reservationHref={reservationHref} />
      <main>
        <section className={styles.intro} aria-labelledby="inicio-titulo">
          <div className={styles.content}>
            <h1 id="inicio-titulo">Relica’s Rock Bar</h1>
            <p>Confira a agenda de shows e explore o cardápio.</p>
            <div className={styles.actions}>
              <Link href="/relicas/agenda">Ver agenda</Link>
              <Link href="/relicas/cardapio">Ver cardápio</Link>
            </div>
          </div>
        </section>
        <section className={styles.section} id="a-casa" aria-labelledby="a-casa-titulo" tabIndex={-1}>
          <h2 id="a-casa-titulo">A Casa</h2>
          <p>Um ponto de encontro para quem gosta de rock. Confira os próximos shows na <Link href="/relicas/agenda">agenda da casa</Link>.</p>
        </section>
        <section className={styles.section} id="galeria" aria-labelledby="galeria-titulo" tabIndex={-1}>
          <h2 id="galeria-titulo">Galeria</h2>
          <p>Ainda não há fotos publicadas.</p>
        </section>
        <section className={styles.section} id="contato" aria-labelledby="contato-titulo" tabIndex={-1}>
          <h2 id="contato-titulo">Contato</h2>
          <p>{reservationHref ? "Fale com a casa pelo WhatsApp para reservar sua mesa." : "O WhatsApp para reservas ainda não está disponível aqui."}</p>
          {(reservationHref || instagramHref) && (
            <div className={styles.contactLinks}>
              {reservationHref && <a href={reservationHref} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>}
              {instagramHref && <a href={instagramHref} target="_blank" rel="noopener noreferrer">Instagram</a>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
