import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Acesso administrativo | Relica's",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
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
