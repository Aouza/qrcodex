import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteEventForm } from "@/components/admin/delete-event-form";
import { EventForm } from "@/components/admin/event-form";
import { EventImageForm } from "@/components/admin/event-image-form";
import styles from "@/components/admin/admin-content.module.css";
import { loadAdminEvent } from "@/lib/admin/load-admin-events";
import { updateEvent } from "./actions";

export const metadata: Metadata = {
  title: "Editar evento | Administração",
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await loadAdminEvent(id);
  if (event === undefined) return null;
  if (!event) notFound();

  const action = updateEvent.bind(null, event.id);

  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Agenda</p>
        <h1>Editar evento</h1>
        <p>Atualize as informações exibidas na Agenda pública.</p>
      </header>
      <EventForm action={action} submitLabel="Salvar alterações" values={event} />
      <EventImageForm eventId={event.id} eventTitle={event.title} imageUrl={event.image_url} />
      <DeleteEventForm eventId={event.id} eventTitle={event.title} />
    </>
  );
}
