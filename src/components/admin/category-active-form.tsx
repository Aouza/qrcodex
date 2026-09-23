"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { setCategoryActive, type CategoryActiveState } from "@/app/admin/(protected)/categories/actions";
import styles from "./admin-categories.module.css";

const initialState: CategoryActiveState = { status: "idle" };

function Switch({ active }: { active: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" role="switch" aria-checked={active} aria-label={active ? "Desativar categoria" : "Ativar categoria"} disabled={pending}><span aria-hidden="true" /></button>;
}

export function CategoryActiveForm({ categoryId, active }: { categoryId: string; active: boolean }) {
  const [state, action] = useActionState(setCategoryActive.bind(null, categoryId, !active), initialState);
  return <form action={action} className={styles.activeForm}>
    <span>{active ? "Ativa" : "Inativa"}</span><Switch active={active} />
    {state.message && <small role={state.status === "error" ? "alert" : "status"} data-error={state.status === "error" || undefined}>{state.message}</small>}
  </form>;
}
