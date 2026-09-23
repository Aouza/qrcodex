"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateEstablishmentSettings } from "@/app/admin/(protected)/settings/actions";
import type { EstablishmentSettingsState } from "@/lib/admin/establishment-settings-state";
import styles from "./product-form.module.css";

const initialState: EstablishmentSettingsState = {};
function SubmitButton() { const { pending } = useFormStatus(); return <button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar configurações"}</button>; }

export function EstablishmentSettingsForm({ values }: { values: { name: string; slug: string; instagram: string; whatsapp: string } }) {
  const [state, action] = useActionState(updateEstablishmentSettings, initialState);
  return <form action={action} className={styles.form} noValidate>
    {state.formError && <p className={styles.formError} role="alert">{state.formError}</p>}
    {state.success && <p className={styles.success} role="status">{state.success}</p>}
    <div className={styles.field}><label htmlFor="settings-name">Nome público</label><input id="settings-name" name="name" maxLength={100} required defaultValue={values.name} aria-invalid={Boolean(state.fieldErrors?.name)} />{state.fieldErrors?.name && <p className={styles.fieldError}>{state.fieldErrors.name}</p>}</div>
    <div className={styles.field}><label htmlFor="settings-slug">Endereço permanente</label><input id="settings-slug" value={`/${values.slug}`} readOnly aria-readonly="true" /><p className={styles.help}>Este endereço não pode ser alterado para preservar o QR Code.</p></div>
    <div className={styles.twoColumns}>
      <div className={styles.field}><label htmlFor="settings-instagram">Instagram <span>Opcional</span></label><input id="settings-instagram" name="instagram" maxLength={31} placeholder="relicasbar" defaultValue={values.instagram} aria-invalid={Boolean(state.fieldErrors?.instagram)} />{state.fieldErrors?.instagram && <p className={styles.fieldError}>{state.fieldErrors.instagram}</p>}</div>
      <div className={styles.field}><label htmlFor="settings-whatsapp">WhatsApp <span>Opcional</span></label><input id="settings-whatsapp" name="whatsapp" type="tel" inputMode="tel" maxLength={24} placeholder="55 11 99999-9999" defaultValue={values.whatsapp} aria-invalid={Boolean(state.fieldErrors?.whatsapp)} />{state.fieldErrors?.whatsapp && <p className={styles.fieldError}>{state.fieldErrors.whatsapp}</p>}</div>
    </div>
    <div className={styles.actions}><SubmitButton /></div>
  </form>;
}
