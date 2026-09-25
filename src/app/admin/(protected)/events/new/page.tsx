import type { Metadata } from "next";
import { EventForm } from "@/components/admin/event-form";
import styles from "@/components/admin/admin-content.module.css";
import { createEvent } from "./actions";

export const metadata: Metadata = {
  title: "Novo evento | Administração",
};

export default function NewEventPage() {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Agenda</p>
        <h1>Novo evento</h1>
        <p>Cadastre um evento como rascunho. O flyer é enviado após a criação.</p>
      </header>
      <EventForm action={createEvent} submitLabel="Criar evento" />
    </>
  );
}
