"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saindo..." : "Sair da conta"}
    </button>
  );
}

export function LogoutForm() {
  const [message, action] = useActionState(signOut, null);

  return (
    <form action={action} className="admin-auth__signout">
      {message && <p className="admin-auth__error" role="alert">{message}</p>}
      <SubmitButton />
    </form>
  );
}
