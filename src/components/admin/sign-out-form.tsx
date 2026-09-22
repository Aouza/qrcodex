"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

type SignOutFormProps = {
  className?: string;
};

export function SignOutForm({ className }: SignOutFormProps) {
  const [message, action] = useActionState(signOut, null);

  return (
    <form action={action} className={className}>
      {message && <p className="admin-auth__error" role="alert">{message}</p>}
      <SubmitButton />
    </form>
  );
}
