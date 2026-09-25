"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteEvent, type DeleteEventState } from "@/app/admin/(protected)/events/[id]/actions";
import styles from "./delete-product-form.module.css";

function ConfirmButton() { const { pending } = useFormStatus(); return <button type="submit" className={styles.confirm} disabled={pending}>{pending ? "Excluindo..." : "Excluir permanentemente"}</button>; }

export function DeleteEventForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, action] = useActionState<DeleteEventState, FormData>(deleteEvent.bind(null, eventId), {});
  useEffect(() => { if (state.success) dialogRef.current?.close(); }, [state.success]);
  return <section className={styles.section}><div><p className={styles.eyebrow}>Exclusão</p><h2>Excluir evento</h2><p>Remove permanentemente o evento e seu flyer.</p></div><button type="button" className={styles.trigger} onClick={() => dialogRef.current?.showModal()}>Excluir evento</button>
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="delete-event-title"><form action={action}><h3 id="delete-event-title">Excluir {eventTitle} permanentemente?</h3><p>Essa ação não pode ser desfeita.</p>{state.error && <p role="alert">{state.error}</p>}<div className={styles.actions}><button type="button" onClick={() => dialogRef.current?.close()}>Cancelar</button><ConfirmButton /></div></form></dialog>
  </section>;
}
