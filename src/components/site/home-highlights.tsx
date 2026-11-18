import { SiteIcon } from "./site-icon";
import { googleReviewSummary } from "@/lib/site/public-content";
import styles from "./home-highlights.module.css";

export function HomeHighlights() {
  return (
    <aside className={styles.band} aria-label="Informações da casa">
      <ul className={styles.items}>
        <li className={styles.item}>
          <SiteIcon name="star" size={30} />
          <div><p className={styles.label}>{googleReviewSummary.score} no Google</p><p className={styles.detail}>{googleReviewSummary.count} avaliações</p></div>
        </li>
        <li className={styles.item}>
          <SiteIcon name="beer" size={30} />
          <div><p className={styles.label}>Preço médio</p><p className={styles.detail}>R$ 40 – 100</p></div>
        </li>
        <li className={styles.item}>
          <SiteIcon name="calendar" size={30} />
          <div><p className={styles.label}>Música ao vivo</p><p className={styles.detail}>Sextas e Sábados</p></div>
        </li>
        <li className={styles.item}>
          <SiteIcon name="people" size={30} />
          <div><p className={styles.label}>Ambiente acolhedor</p><p className={styles.detail}>e LGBT+ friendly</p></div>
        </li>
      </ul>
    </aside>
  );
}
