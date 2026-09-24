"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  removeEstablishmentLogo,
  uploadEstablishmentLogo,
  type EstablishmentLogoState,
} from "@/app/admin/(protected)/settings/logo-actions";
import styles from "./product-image-form.module.css";

const initialState: EstablishmentLogoState = { status: "idle" };

function ActionButton({ busy, ready }: { busy: string; ready: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? busy : ready}</button>;
}

export function EstablishmentLogoForm({
  establishmentName,
  logoUrl,
  fallbackUrl,
}: {
  establishmentName: string;
  logoUrl: string | null;
  fallbackUrl: string | null;
}) {
  const [uploadState, uploadAction] = useActionState(uploadEstablishmentLogo, initialState);
  const [removeState, removeAction] = useActionState(removeEstablishmentLogo, initialState);
  const message = uploadState.message ?? removeState.message;
  const failed = uploadState.status === "error" || removeState.status === "error";

  return (
    <section className={styles.section} aria-labelledby="establishment-logo-title">
      <div>
        <p className={styles.eyebrow}>Identidade visual</p>
        <h2 id="establishment-logo-title">Logo do estabelecimento</h2>
        <p>Imagem quadrada em JPEG, PNG ou WebP de até 768 KB.</p>
      </div>
      <div className={styles.editor}>
        {logoUrl ?? fallbackUrl ? (
          <Image
            className={styles.preview}
            src={(logoUrl ?? fallbackUrl)!}
            alt={`Logo de ${establishmentName}`}
            width={160}
            height={160}
            sizes="160px"
          />
        ) : (
          <div className={styles.placeholder}>Sem logo</div>
        )}
        <div className={styles.controls}>
          <form action={uploadAction}>
            <label htmlFor="establishment-logo">Selecionar logo</label>
            <input
              id="establishment-logo"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <ActionButton busy="Enviando..." ready="Salvar logo" />
          </form>
          {logoUrl && (
            <form action={removeAction} className={styles.remove}>
              <ActionButton busy="Removendo..." ready="Usar logo padrão" />
            </form>
          )}
          {message && <p role={failed ? "alert" : "status"} data-error={failed || undefined}>{message}</p>}
        </div>
      </div>
    </section>
  );
}
