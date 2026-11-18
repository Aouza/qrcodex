import Image from "next/image";
import Link from "next/link";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./site-hero.module.css";

export function SiteHero({ imageSrc, reservationHref }: { imageSrc: string | null; reservationHref?: string | null }) {
  return (
    <section className={styles.hero} aria-labelledby="inicio-titulo">
      {imageSrc && (
        <div className={styles.scene}>
          <Image className={styles.photograph} src={imageSrc} alt="" fill sizes="(max-width: 925px) 100vw, (max-width: 1155px) 925px, (max-width: 1689px) 80vw, 1351px" preload />
        </div>
      )}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Relica’s Rock Bar<span aria-hidden="true" /></p>
          <h1 id="inicio-titulo" className={styles.title}>
            <span>O ponto de encontro</span>{" "}
            <span>do rock na zona sul</span>{" "}
            <span>de São Paulo.</span>
          </h1>
          <p className={styles.description}>Shows ao vivo, cerveja gelada,<br className={styles.desktopBreak} /> petiscos e uma galera que vive o rock<br className={styles.desktopBreak} /> de verdade.</p>
          <div className={styles.actions}>
            <a href={reservationHref ?? "#contato"} target={reservationHref ? "_blank" : undefined} rel={reservationHref ? "noopener noreferrer" : undefined} className={`${ui.button} ${ui.primary}`}>
              <SiteIcon name="calendar" />Reserve sua mesa<SiteIcon name="arrow" size={18} />
            </a>
            <Link href="/relicas/agenda" className={ui.button}><SiteIcon name="play" size={18} />Ver a agenda</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
