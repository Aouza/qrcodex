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
            <h2 className={ui.heading} id="a-casa-titulo"><span>Mais que um bar,</span>{" "}<span>um refúgio do rock.</span></h2>
            <p className={ui.copy}>Um bar simples, autêntico e feito por quem vive a música. Aqui, o rock rola solto, as bandas têm espaço e o público faz parte dessa história há anos.</p>
          </div>
          <div className={styles.houseArtwork}>
            <Image src="/images/a-casa.png" alt="" fill sizes="(max-width: 959px) calc(100vw - 40px), (max-width: 1280px) 60vw, 768px" />
          </div>
        </div>
      </section>
    </>
  );
}
