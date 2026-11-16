import Image from "next/image";
import Link from "next/link";
import styles from "./site-hero.module.css";

export function SiteHero({ imageSrc }: { imageSrc: string | null }) {
  return (
    <section className={styles.hero} aria-labelledby="inicio-titulo">
      {imageSrc && (
        <Image
          className={styles.photograph}
          src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          preload
        />
      )}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Rock ao vivo<span aria-hidden="true" /></p>
          <h1 id="inicio-titulo" className={styles.title}>
            <span>Mais que</span>{" "}
            <span>um bar,</span>{" "}
            <span className={styles.red}>uma casa</span>{" "}
            <span className={styles.red}>do rock.</span>
          </h1>
          <p className={styles.description}>Música, encontros e bons momentos.<br />Conheça o Relica’s Rock Bar.</p>
          <div className={styles.actions}>
            <Link href="/relicas/agenda" className={styles.primary}>
              <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18M7 15h2m3 0h2m3 0h.01M7 18h2m3 0h2" />
              </svg>
              Ver agenda
            </Link>
            <Link href="/relicas/cardapio" className={styles.secondary}>
              <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4h10l-1.5 16h-7L7 4Zm.5 4h9M10 11l.5 6m3.5-6-.5 6M9 20h6" /><ellipse cx="12" cy="4" rx="5" ry="2" />
              </svg>
              Ver cardápio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
