import { isSiteReview } from "@/lib/site/review-content";
import ui from "./site-ui.module.css";
import styles from "./home-testimonials.module.css";

const reviewTestimonials = [
  { quote: "Ambiente incrível, som sempre alto na medida certa e uma galera que realmente vive o rock.", author: "Marcos T." },
  { quote: "O melhor bar de rock da zona sul. Atendimento ótimo, cerveja gelada e shows pesados!", author: "Juliana S." },
  { quote: "Sempre que quero ver um bom tributo e curtir com os amigos, acabo no Relica’s. Nunca decepciona.", author: "Rodrigo M." },
] as const;

export function HomeTestimonials() {
  if (!isSiteReview()) return null;
  return (
    <section className={styles.band} aria-labelledby="depoimentos-titulo">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <p className={ui.eyebrow}>O que</p>
          <h2 id="depoimentos-titulo" className={ui.heading}>A galera diz</h2>
          <p className={ui.notice}>Depoimentos ilustrativos</p>
        </div>
        {reviewTestimonials.map(({ quote, author }) => (
          <figure className={styles.testimonial} key={author}>
            <span className={styles.quoteMark} aria-hidden="true">“</span>
            <blockquote><p>“{quote}”</p></blockquote>
            <figcaption>— {author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
