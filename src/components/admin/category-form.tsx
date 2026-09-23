"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { CategoryFormAction, CategoryFormState } from "@/lib/admin/category-form-state";
import styles from "./product-form.module.css";

const initialState: CategoryFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Salvando..." : label}</button>;
}

export function CategoryForm({
  action: formAction,
  submitLabel,
  values,
}: {
  action: CategoryFormAction;
  submitLabel: string;
  values?: { name: string; slug: string };
}) {
  const [state, action] = useActionState(formAction, initialState);

  return (
    <form action={action} className={styles.form} noValidate>
      {state.formError && <p className={styles.formError} role="alert">{state.formError}</p>}
      <div className={styles.field}>
        <label htmlFor="category-name">Nome</label>
        <input id="category-name" name="name" type="text" maxLength={80} required defaultValue={values?.name} aria-invalid={Boolean(state.fieldErrors?.name)} />
        {state.fieldErrors?.name && <p className={styles.fieldError}>{state.fieldErrors.name}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="category-slug">Identificador da URL</label>
        <input id="category-slug" name="slug" type="text" maxLength={80} required defaultValue={values?.slug} placeholder="drinks-e-doses" aria-invalid={Boolean(state.fieldErrors?.slug)} />
        <p className={styles.help}>Use letras minúsculas, números e hífens.</p>
        {state.fieldErrors?.slug && <p className={styles.fieldError}>{state.fieldErrors.slug}</p>}
      </div>
      <div className={styles.actions}>
        <Link href="/admin/categories">Cancelar</Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
