import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";
import categoryStyles from "@/components/admin/admin-categories.module.css";
import { loadAdminEvents } from "@/lib/admin/load-admin-events";

export const metadata: Metadata = {
  title: "Eventos | Administração",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const [events, query] = await Promise.all([loadAdminEvents(), searchParams]);
  if (!events) return null;

  const successMessage = query.created === "1"
    ? "Evento criado com sucesso."
    : query.updated === "1"
      ? "Evento atualizado com sucesso."
      : query.deleted === "1"
        ? "Evento excluído permanentemente."
        : null;

  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Agenda</p>
        <h1>Eventos</h1>
        <p>Gerencie os shows e eventos exibidos na Agenda pública.</p>
      </header>
      <div className={categoryStyles.toolbar}>
        <Link href="/admin/events/new">Novo evento</Link>
      </div>
      {successMessage && <p className={categoryStyles.success} role="status">{successMessage}</p>}
      {events.length ? (
        <div className={styles.actions}>
          {events.map((event) => (
            <Link key={event.id} href={`/admin/events/${event.id}`} className={styles.action}>
              <span>
                <strong>{event.title}</strong>
                <span>{dateFormatter.format(new Date(event.starts_at))} · {event.active ? "Publicado" : "Rascunho"}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.pending}>
          <strong>Nenhum evento</strong>
          <p>Crie o primeiro evento para começar a preencher a Agenda.</p>
        </div>
      )}
    </>
  );
}
