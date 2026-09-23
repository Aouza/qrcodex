"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  setProductAvailability,
  type AvailabilityState,
} from "@/app/admin/(protected)/products/actions";
import styles from "./admin-products.module.css";

const initialState: AvailabilityState = { status: "idle" };

function AvailabilityControl({ available }: { available: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className={styles.availabilityControl}>
      <span>{pending ? "Atualizando..." : available ? "Disponível" : "Esgotado"}</span>
      <button
        type="submit"
        role="switch"
        aria-checked={available}
        aria-label={available ? "Marcar produto como esgotado" : "Marcar produto como disponível"}
        disabled={pending}
      >
        <span aria-hidden="true" />
      </button>
    </div>
  );
}

export function AvailabilityForm({
  productId,
  available,
}: {
  productId: string;
  available: boolean;
}) {
  const action = setProductAvailability.bind(null, productId, !available);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className={styles.availabilityForm}>
      <AvailabilityControl available={available} />
      {state.message && (
        <span role={state.status === "error" ? "alert" : "status"} data-error={state.status === "error" || undefined}>
          {state.message}
        </span>
      )}
    </form>
  );
}
