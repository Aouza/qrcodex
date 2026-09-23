"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { moveCategory, type CategoryOrderState } from "@/app/admin/(protected)/categories/actions";
import styles from "./admin-categories.module.css";

const initialState: CategoryOrderState = { status: "idle" };

function MoveButton({ direction, disabled }: { direction: -1 | 1; disabled: boolean }) {
  const { pending } = useFormStatus();
  const label = direction === -1 ? "Mover categoria para cima" : "Mover categoria para baixo";
  return <button type="submit" disabled={disabled || pending} aria-label={label} title={label}>{direction === -1 ? "↑" : "↓"}</button>;
}

function MoveForm({ categoryId, direction, disabled }: { categoryId: string; direction: -1 | 1; disabled: boolean }) {
  const [state, action] = useActionState(moveCategory.bind(null, categoryId, direction), initialState);
  return <form action={action}><MoveButton direction={direction} disabled={disabled} />{state.message && <span className={styles.visuallyHidden} role={state.status === "error" ? "alert" : "status"}>{state.message}</span>}</form>;
}

export function CategoryOrderForm({ categoryId, first, last }: { categoryId: string; first: boolean; last: boolean }) {
  return <div className={styles.orderControls} aria-label="Alterar posição"><MoveForm categoryId={categoryId} direction={-1} disabled={first} /><MoveForm categoryId={categoryId} direction={1} disabled={last} /></div>;
}
