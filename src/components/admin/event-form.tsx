"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { EventFormAction, EventFormState } from "@/lib/admin/event-form-state";
import { formatEventDateTimeInput } from "@/lib/validation/event";
import styles from "./product-form.module.css";

const initialState: EventFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Salvando..." : label}</button>;
}

export function EventForm({ action: formAction, submitLabel, values }: {
  action: EventFormAction;
  submitLabel: string;
  values?: { title: string; description: string | null; starts_at: string; ends_at: string | null; external_url: string | null; active: boolean; image_url: string | null };
}) {
  const [state, action] = useActionState(formAction, initialState);
  return <form action={action} className={styles.form} noValidate>
    {state.formError && <p className={styles.formError} role="alert">{state.formError}</p>}
    <div className={styles.field}><label htmlFor="event-title">Título</label><input id="event-title" name="title" maxLength={120} required defaultValue={values?.title} aria-invalid={Boolean(state.fieldErrors?.title)} />{state.fieldErrors?.title && <p className={styles.fieldError}>{state.fieldErrors.title}</p>}</div>
    <div className={styles.field}><label htmlFor="event-description">Descrição <span>opcional</span></label><textarea id="event-description" name="description" maxLength={1200} defaultValue={values?.description ?? ""} aria-invalid={Boolean(state.fieldErrors?.description)} />{state.fieldErrors?.description && <p className={styles.fieldError}>{state.fieldErrors.description}</p>}</div>
    <div className={styles.twoColumns}>
      <div className={styles.field}><label htmlFor="event-start">Início</label><input id="event-start" name="startsAt" type="datetime-local" required defaultValue={formatEventDateTimeInput(values?.starts_at ?? null)} aria-invalid={Boolean(state.fieldErrors?.startsAt)} />{state.fieldErrors?.startsAt && <p className={styles.fieldError}>{state.fieldErrors.startsAt}</p>}</div>
      <div className={styles.field}><label htmlFor="event-end">Término <span>opcional</span></label><input id="event-end" name="endsAt" type="datetime-local" defaultValue={formatEventDateTimeInput(values?.ends_at ?? null)} aria-invalid={Boolean(state.fieldErrors?.endsAt)} />{state.fieldErrors?.endsAt && <p className={styles.fieldError}>{state.fieldErrors.endsAt}</p>}</div>
    </div>
    <div className={styles.field}><label htmlFor="event-url">Link externo <span>opcional</span></label><input id="event-url" name="externalUrl" type="url" maxLength={500} placeholder="https://..." defaultValue={values?.external_url ?? ""} aria-invalid={Boolean(state.fieldErrors?.externalUrl)} />{state.fieldErrors?.externalUrl && <p className={styles.fieldError}>{state.fieldErrors.externalUrl}</p>}</div>
    {values && <fieldset className={styles.states}><legend>Publicação</legend><label><input name="active" type="checkbox" defaultChecked={values.active} disabled={!values.image_url} /><span><strong>Evento publicado</strong><small>{values.image_url ? "Aparece na Agenda pública enquanto estiver em andamento ou no futuro." : "Envie o flyer antes de publicar."}</small></span></label></fieldset>}
    <div className={styles.actions}><Link href="/admin/events">Cancelar</Link><SubmitButton label={submitLabel} /></div>
  </form>;
}
