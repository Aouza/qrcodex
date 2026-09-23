"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { changePassword } from "@/app/admin/(protected)/account/actions";
import type { AccountPasswordState } from "@/lib/admin/account-password-state";
import styles from "./product-form.module.css";

const initialState: AccountPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Alterando..." : "Alterar senha"}
    </button>
  );
}

export function AccountPasswordForm() {
  const [state, action] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className={styles.form} noValidate>
      {state.formError && (
        <p className={styles.formError} role="alert">{state.formError}</p>
      )}
      {state.success && (
        <p className={styles.success} role="status">{state.success}</p>
      )}

      <div className={styles.field}>
        <label htmlFor="current-password">Senha atual</label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.currentPassword)}
          aria-describedby={state.fieldErrors?.currentPassword ? "current-password-error" : undefined}
        />
        {state.fieldErrors?.currentPassword && (
          <p id="current-password-error" className={styles.fieldError}>{state.fieldErrors.currentPassword}</p>
        )}
      </div>

      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor="new-password">Nova senha</label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            aria-invalid={Boolean(state.fieldErrors?.newPassword)}
            aria-describedby="new-password-help"
          />
          <p id="new-password-help" className={state.fieldErrors?.newPassword ? styles.fieldError : styles.help}>
            {state.fieldErrors?.newPassword ?? "Use 12 ou mais caracteres, com letras e números."}
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-password">Confirmar nova senha</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
            aria-describedby={state.fieldErrors?.confirmPassword ? "confirm-password-error" : undefined}
          />
          {state.fieldErrors?.confirmPassword && (
            <p id="confirm-password-error" className={styles.fieldError}>{state.fieldErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      <p className={styles.help}>
        Após a alteração, esta sessão continuará ativa e as demais serão encerradas.
      </p>
      <div className={styles.actions}><SubmitButton /></div>
    </form>
  );
}
