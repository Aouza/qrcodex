import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublicAgenda } from "@/lib/agenda/load-public-agenda";
import { getEstablishmentLogo } from "@/lib/menu/get-establishment-logo";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function PublicAgendaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agenda = await loadPublicAgenda(slug);
  if (!agenda) notFound();

  const logoUrl = getEstablishmentLogo(agenda.establishment.logo_url, agenda.establishment.slug);

  return (
    <main className="public-agenda">
      <header className="public-agenda__header">
        <div className="public-agenda__inner">
          <Link className="public-agenda__back" href={`/${slug}`}><span aria-hidden="true">←</span> Início</Link>
          <div className="public-agenda__identity">
            {logoUrl && <Image src={logoUrl} alt={`Logo de ${agenda.establishment.name}`} width={64} height={64} className="public-agenda__logo" priority />}
            <div><p>Programação</p><strong>{agenda.establishment.name}</strong></div>
          </div>
          <h1>Agenda</h1>
          <p className="public-agenda__intro">Shows e eventos que vêm por aí.</p>
        </div>
      </header>

      <section className="public-agenda__inner public-agenda__content" aria-labelledby="agenda-events-title">
        <div className="public-agenda__section-heading">
          <p>Próximos eventos</p>
          <h2 id="agenda-events-title">Reserve a data</h2>
        </div>

        {agenda.events.length === 0 ? (
          <div className="public-agenda__empty">
            <h3>Nenhum evento publicado</h3>
            <p>A próxima programação será anunciada por aqui.</p>
          </div>
        ) : (
          <ol className="public-agenda__events">
            {agenda.events.map((event) => (
              <li key={event.id} className="public-agenda__event">
                <div className="public-agenda__flyer">
                  <Image src={event.image_url} alt={`Flyer de ${event.title}`} fill sizes="(max-width: 719px) 100vw, 440px" />
                </div>
                <div className="public-agenda__event-copy">
                  <time dateTime={event.starts_at}>
                    <span>{dateFormatter.format(new Date(event.starts_at))}</span>
                    <strong>{timeFormatter.format(new Date(event.starts_at))}</strong>
                  </time>
                  <h3>{event.title}</h3>
                  {event.description && <p>{event.description}</p>}
                  {event.external_url && <a href={event.external_url} target="_blank" rel="noreferrer">Saiba mais <span aria-hidden="true">↗</span></a>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
