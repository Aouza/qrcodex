import Image from "next/image";
import Link from "next/link";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./site-hero.module.css";

export function SiteHero({ imageSrc, reservationHref }: { imageSrc: string | null; reservationHref?: string | null }) {
  return (
    <section className={styles.hero} aria-labelledby="inicio-titulo">
      {imageSrc && <Image className={styles.photograph} src={imageSrc} alt="" fill sizes="100vw" preload />}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Rock ao vivo<span aria-hidden="true" /></p>
          <h1 id="inicio-titulo" className={styles.title}>
            <span>Mais que um bar,</span>{" "}
            <span>uma casa do</span>{" "}
            <span className={styles.rock}>rock.</span>
          </h1>
          <p className={styles.description}>Shows, boa bebida, petiscos e a energia<br className={styles.desktopBreak} /> do rock em um ambiente autêntico.</p>
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
