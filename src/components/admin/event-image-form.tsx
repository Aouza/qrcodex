"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { removeEventImage, uploadEventImage, type EventImageState } from "@/app/admin/(protected)/events/[id]/image-actions";
import styles from "./product-image-form.module.css";

const initialState: EventImageState = { status: "idle" };
function ActionButton({ busy, ready }: { busy: string; ready: string }) { const { pending } = useFormStatus(); return <button type="submit" disabled={pending}>{pending ? busy : ready}</button>; }

export function EventImageForm({ eventId, eventTitle, imageUrl }: { eventId: string; eventTitle: string; imageUrl: string | null }) {
  const [uploadState, uploadAction] = useActionState(uploadEventImage.bind(null, eventId), initialState);
  const [removeState, removeAction] = useActionState(removeEventImage.bind(null, eventId), initialState);
  const message = uploadState.message ?? removeState.message;
  const failed = uploadState.status === "error" || removeState.status === "error";
  return <section className={styles.section} aria-labelledby="event-image-title"><div><p className={styles.eyebrow}>Flyer</p><h2 id="event-image-title">Banner do evento</h2><p>Obrigatório para publicar. JPEG, PNG ou WebP de até 768 KB.</p></div><div className={styles.editor}>
    {imageUrl ? <Image className={styles.preview} src={imageUrl} alt={`Flyer de ${eventTitle}`} width={160} height={200} sizes="160px" /> : <div className={styles.preview} role="img" aria-label="Evento sem flyer" />}
    <div className={styles.controls}><form action={uploadAction}><label htmlFor="event-image">Selecionar flyer</label><input id="event-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required /><ActionButton busy="Enviando..." ready="Salvar flyer" /></form>
    {imageUrl && <form action={removeAction} className={styles.remove}><ActionButton busy="Removendo..." ready="Remover flyer" /></form>}
    {message && <p role={failed ? "alert" : "status"} data-error={failed || undefined}>{message}</p>}</div>
  </div></section>;
}
