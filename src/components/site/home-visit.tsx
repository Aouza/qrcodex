import Image from "next/image";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./home-visit.module.css";

export function HomeVisit({ reservationHref }: { reservationHref: string | null }) {
  return (
    <section className={styles.band} id="localizacao" aria-labelledby="localizacao-titulo" tabIndex={-1}>
      <div className={styles.inner}>
        <div className={styles.playlist}>
          <Image className={styles.vinyl} src="/assets/site-review/spotify/vinil-decorativo.webp" alt="" fill sizes="220px" />
          <div className={styles.playlistCopy}>
            <div className={styles.label}><SiteIcon name="music" size={32} /><h2>Nossa playlist</h2></div>
            <p className={ui.copy}>A trilha sonora do Relica’s<br />para você curtir onde estiver.</p>
            <p className={styles.pending}>Link oficial em breve.</p>
          </div>
        </div>
        <div className={styles.location}>
          <div className={styles.label}><span className={styles.pin}><SiteIcon name="pin" size={32} /></span><h2 id="localizacao-titulo">Onde estamos</h2></div>
          <p className={ui.copy}>Consulte a casa para confirmar<br />o endereço e os horários.</p>
          <a className={ui.button} href={reservationHref ?? "#contato"} target={reservationHref ? "_blank" : undefined} rel={reservationHref ? "noopener noreferrer" : undefined}>Consultar localização<SiteIcon name="arrow" size={18} /></a>
        </div>
        <div className={styles.map}>
          <Image src="/assets/site-review/mapa/mapa-ilustrativo.webp" alt="" fill sizes="(max-width: 767px) 100vw, 340px" />
          <p className={ui.notice}>Mapa ilustrativo • localização a confirmar</p>
        </div>
      </div>
    </section>
  );
}
