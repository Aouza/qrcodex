import Image from "next/image";
import Link from "next/link";
import type { HomeEventsResult } from "@/lib/site/load-home-events";
import { SiteIcon } from "./site-icon";
import ui from "./site-ui.module.css";
import styles from "./home-agenda.module.css";

const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Sao_Paulo" });
const month = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Sao_Paulo" });
const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "America/Sao_Paulo" });
const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
const accessibleDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export function HomeAgenda({ result, reservationHref, review = false }: { result: HomeEventsResult; reservationHref?: string | null; review?: boolean }) {
  return (
    <section className={styles.band} id="agenda" aria-labelledby="home-agenda-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          {review && <Image className={styles.microphone} src="/images/microfone-agenda.png" alt="" fill sizes="(max-width: 767px) 150px, 180px" />}
          <div className={styles.headingCopy}>
            <p className={ui.eyebrow}>Agenda</p>
            <h2 className={ui.heading} id="home-agenda-title">Próximos<br />shows</h2>
            <p className={ui.copy}>Confira as próximas apresentações e garanta sua mesa.</p>
            <span className={styles.underline} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.program}>
          {result.status === "ready" && result.events.length > 0 ? (
            <ul className={styles.events}>
              {result.events.map(event => {
                const date = new Date(event.starts_at);
                const hour = time.format(date).replace(":", "h").replace(/h00$/, "h");
                return (
                  <li key={event.id} className={styles.event}>
                    <time dateTime={event.starts_at} aria-label={accessibleDate.format(date)} className={styles.date}>
                      <span>{weekday.format(date).replace(".", "").toUpperCase()}</span>
                      <strong>{day.format(date)}</strong>
                      <span>{month.format(date).replace(".", "").toUpperCase()}</span>
                    </time>
                    <div className={styles.details}>
                      <h3>{event.title}</h3>
                      {event.description && <p className={styles.description}>{event.description}</p>}
                      <p className={styles.meta}><span><SiteIcon name="clock" size={14} />{hour}</span><span><SiteIcon name="pin" size={14} />Relica’s</span></p>
                    </div>
                    <div className={styles.flyer} aria-hidden="true"><Image src={event.image_url} alt="" fill sizes="(max-width: 639px) 150px, 320px" /></div>
                    {reservationHref && <a href={reservationHref} target="_blank" rel="noopener noreferrer" className={`${ui.button} ${styles.reserve}`} aria-label={`Reservar mesa para ${event.title}`}>Reservar mesa<SiteIcon name="arrow" size={17} /></a>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.message} role={result.status === "loading" ? "status" : undefined}>
              {result.status === "error" ? "Não foi possível carregar os shows agora. Consulte a agenda completa ou tente novamente mais tarde."
                : result.status === "loading" ? "Carregando próximos shows…" : "Nenhum show anunciado no momento. Novidades em breve."}
            </p>
          )}
          <Link href="/relicas/agenda" className={styles.all}>Ver agenda completa<SiteIcon name="arrow" size={22} /></Link>
        </div>
      </div>
    </section>
  );
}
