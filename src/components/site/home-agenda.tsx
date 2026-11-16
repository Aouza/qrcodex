import Link from "next/link";
import type { CSSProperties } from "react";
import type { HomeEventsResult } from "@/lib/site/load-home-events";
import styles from "./home-agenda.module.css";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "America/Sao_Paulo" });
const accessibleDateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export function HomeAgenda({ result }: { result: HomeEventsResult }) {
  return (
    <section className={styles.band} aria-labelledby="home-agenda-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <p>Agenda</p>
          <h2 id="home-agenda-title">Próximos<br />shows</h2>
          <span className={styles.underline} aria-hidden="true" />
        </div>
        {result.status === "ready" && result.events.length > 0 ? (
          <ul className={styles.events} style={{ "--event-count": result.events.length } as CSSProperties}>
            {result.events.map(event => (
              <li key={event.id} className={styles.event}>
                <time dateTime={event.starts_at} aria-label={accessibleDateFormat.format(new Date(event.starts_at))}>
                  <span>{weekdayFormat.format(new Date(event.starts_at)).replace(".", "").toUpperCase()}</span>
                  {dateFormat.format(new Date(event.starts_at))}
                </time>
                <div>
                  <h3>{event.title}</h3>
                  {event.description && <p className={styles.description}>{event.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.message} role={result.status === "loading" ? "status" : undefined}>
            {result.status === "error" ? "Não foi possível carregar os shows agora. Consulte a agenda completa ou tente novamente mais tarde."
              : result.status === "loading" ? "Carregando próximos shows…" : "Nenhum show anunciado no momento. Novidades em breve."}
          </p>
        )}
        <Link href="/relicas/agenda" className={styles.all}>
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="16" cy="16" r="13" /><path d="M9 16h14m-6-6 6 6-6 6" />
          </svg>
          <span>Ver agenda<br />completa</span>
        </Link>
      </div>
    </section>
  );
}
