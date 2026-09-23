"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteProduct,
  type DeleteProductState,
} from "@/app/admin/(protected)/products/[id]/actions";
import styles from "./delete-product-form.module.css";

const initialState: DeleteProductState = {};

function DialogActions({ closeDialog }: { closeDialog: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.cancel} onClick={closeDialog} disabled={pending} autoFocus>Cancelar</button>
      <button type="submit" className={styles.confirm} disabled={pending}>{pending ? "Excluindo..." : "Excluir permanentemente"}</button>
    </div>
  );
}

export function DeleteProductForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const action = deleteProduct.bind(null, productId);
  const [state, formAction] = useActionState(action, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <section className={styles.section} aria-labelledby="delete-product-title">
      <div>
        <h2 id="delete-product-title">Excluir produto</h2>
        <p>A exclusão é permanente. Para apenas ocultar o item do cardápio, desmarque <strong>Ativo</strong> acima.</p>
      </div>
      <div className={styles.triggerArea}>
        {state.error && <p className={styles.error} role="alert">{state.error}</p>}
        <button type="button" className={styles.trigger} onClick={() => dialogRef.current?.showModal()}>Excluir produto</button>
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="delete-dialog-title">
        <form action={formAction}>
          <input type="hidden" name="confirmed" value="yes" />
          <h3 id="delete-dialog-title">Excluir {productName} permanentemente?</h3>
          <p>O produto será removido do admin e do cardápio. Esta ação não pode ser desfeita.</p>
          <DialogActions closeDialog={closeDialog} />
        </form>
      </dialog>
    </section>
  );
}
