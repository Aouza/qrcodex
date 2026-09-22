import type { Metadata } from "next";
import { AuthShell } from "@/components/admin/auth-shell";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { LogoutForm } from "./logout-form";

export const metadata: Metadata = {
  title: "Acesso administrativo | Relica's",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <AuthShell
        eyebrow="Conta conectada"
        title="Sessão ativa"
        description={<>Você entrou como <strong>{user.email}</strong>.</>}
      >
        <LogoutForm />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Acesso administrativo"
      title="Entrar"
      description="Acesse com o e-mail e a senha da sua conta."
    >
      <LoginForm />
    </AuthShell>
  );
}
