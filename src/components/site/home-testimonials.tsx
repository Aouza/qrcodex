import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import { googleReviewSummary } from "@/lib/site/public-content";
import styles from "./home-testimonials.module.css";

const testimonials = [
  {
    quote: "Ótimo lugar para uma noite de rock, excelentes cantores. Bebida e comida com preços bons, sem absurdos e alguns dias tem caipirinha em dobro.",
    author: "Gilson Amorim",
  },
  {
    quote: "Achei o ambiente bacana, você ao longo da noite vai vendo a galera que cola sempre se encontrando em um clima de amizade.",
    author: "Karol Paixão",
  },
  {
    quote: "Bandas ótimas, preços muito bons e o principal: LGBT+ friendly! Os donos são uns amores, e tratam muito bem independente do gênero ou orientação sexual.",
    author: "Jéssica Castro",
  },
] as const;

export function HomeTestimonials({ reviewsHref }: { reviewsHref?: string | null } = {}) {
  return (
    <section className={styles.band} aria-labelledby="depoimentos-titulo">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <p className={ui.eyebrow}>Depoimentos</p>
          <h2 id="depoimentos-titulo" className={ui.heading}>Quem vem,<br />faz parte.</h2>
          <div className={styles.rating}>
            <span className={styles.googleMark} aria-hidden="true"><span>G</span></span>
            <div>
              <p className={styles.score}>{googleReviewSummary.score} no Google</p>
              <p className={styles.reviewCount}>{googleReviewSummary.count} avaliações</p>
              {reviewsHref && <a href={reviewsHref} target="_blank" rel="noopener noreferrer" className={styles.reviewsLink}>Ver avaliações<SiteIcon name="arrow" size={18} /></a>}
            </div>
          </div>
        </div>
        {testimonials.map(({ quote, author }) => (
          <figure className={styles.testimonial} key={author}>
            <span className={styles.quoteMark} aria-hidden="true">“</span>
            <blockquote><p>{quote}</p></blockquote>
            <figcaption>{author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
