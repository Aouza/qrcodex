import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeAgenda } from "@/components/site/home-agenda";
import { HomeAgendaSection } from "@/components/site/home-agenda-section";
import { HomeFeatures } from "@/components/site/home-features";
import { HomeHighlights } from "@/components/site/home-highlights";
import { HomeTestimonials } from "@/components/site/home-testimonials";
import { HomeVisit } from "@/components/site/home-visit";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteHero } from "@/components/site/site-hero";
import { loadSiteContacts } from "@/lib/site/load-site-contacts";
import { getReservationHref } from "@/lib/site/reservation-link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Relica’s Rock Bar — Uma casa do rock",
  description: "Shows, boa bebida e a energia do rock. Confira a agenda e o cardápio do Relica’s Rock Bar.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const contacts = await loadSiteContacts();
  const reservationHref = getReservationHref(contacts?.whatsapp);
  const instagram = contacts?.instagram;
  const instagramHref = instagram && /^[a-zA-Z0-9._]{1,30}$/.test(instagram)
    ? `https://instagram.com/${instagram}` : null;

  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader reservationHref={reservationHref} />
      <main id="conteudo" tabIndex={-1}>
        <SiteHero imageSrc="/images/hero/hero-relicas.png" reservationHref={reservationHref} />
        <HomeHighlights />
        <Suspense fallback={<HomeAgenda result={{ status: "loading", events: [] }} reservationHref={reservationHref} />}>
          <HomeAgendaSection reservationHref={reservationHref} />
        </Suspense>
        <HomeFeatures />
        <HomeTestimonials />
        <HomeVisit reservationHref={reservationHref} />
      </main>
      <SiteFooter reservationHref={reservationHref} instagramHref={instagramHref} />
    </div>
  );
}
