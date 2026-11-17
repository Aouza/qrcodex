import Image from "next/image";
import Link from "next/link";
import { siteNavigation } from "@/lib/site/navigation";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./site-footer.module.css";

export function SiteFooter({ reservationHref, instagramHref }: { reservationHref: string | null; instagramHref: string | null }) {
  return (
    <footer className={styles.footer} id="contato" tabIndex={-1}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}><Image src="/images/logo/logo-site.png" alt="Relica’s Rock Bar — Início" width={128} height={64} sizes="128px" /></Link>
        <nav aria-label="Navegação do rodapé" className={styles.navigation}>
          {siteNavigation.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className={styles.contact}>
          {instagramHref && <a href={instagramHref} target="_blank" rel="noopener noreferrer" aria-label="Instagram do Relica’s"><SiteIcon name="instagram" size={26} /></a>}
          {reservationHref && <a href={reservationHref} target="_blank" rel="noopener noreferrer">WhatsApp<SiteIcon name="arrow" size={18} /></a>}
          {!reservationHref && <p className={ui.notice}>WhatsApp para reservas ainda não disponível.</p>}
        </div>
      </div>
      <p className={styles.copyright}>Relica’s Rock Bar <span aria-hidden="true">·</span> Uma casa do rock.</p>
    </footer>
  );
}
