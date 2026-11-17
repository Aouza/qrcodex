import Image from "next/image";
import Link from "next/link";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./home-features.module.css";

export function HomeFeatures() {
  return (
    <>
      <section className={styles.menu} aria-labelledby="cardapio-titulo">
        <div className={styles.menuArtwork}>
          <Image className={styles.menuImage} src="/images/comidas-cardapio-section.png" alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" />
        </div>
        <div className={styles.menuInner}>
          <div className={styles.menuCopy}>
            <p className={ui.eyebrow}>Cardápio</p>
            <h2 className={ui.heading} id="cardapio-titulo">Drinks &amp; petiscos</h2>
            <p className={ui.copy}>Cervejas geladas, drinks clássicos e porções caprichadas para acompanhar o som.</p>
            <Link className={ui.button} href="/relicas/cardapio">Ver cardápio<SiteIcon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
      <section className={styles.house} id="a-casa" aria-labelledby="a-casa-titulo" tabIndex={-1}>
        <div className={styles.houseInner}>
          <div className={styles.houseCopy}>
            <p className={ui.eyebrow}>A Casa</p>
            <h2 className={ui.heading} id="a-casa-titulo">O Relica’s</h2>
            <p className={ui.copy}>Um bar feito por e para quem vive o rock. Um espaço para curtir shows ao vivo, encontrar amigos e celebrar a cultura do rock.</p>
            <a className={ui.button} href="#localizacao">Conhecer a casa<SiteIcon name="arrow" size={18} /></a>
          </div>
          <div className={styles.houseArtwork}>
            <Image src="/assets/site-review/casa/ambiente-conceitual.webp" alt="" fill sizes="(max-width: 520px) calc(100vw - 40px), 480px" />
          </div>
        </div>
      </section>
    </>
  );
}
