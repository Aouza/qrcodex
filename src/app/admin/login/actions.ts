"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function signIn(
  _previousMessage: string | null,
  formData: FormData,
): Promise<string | null> {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!credentials.success) {
    return "Informe um e-mail válido e sua senha.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);

  if (error) {
    return error.code === "invalid_credentials"
      ? "E-mail ou senha inválidos. Confira os dados e tente novamente."
      : "Não foi possível entrar agora. Tente novamente.";
  }

  redirect("/admin/login");
}

export async function signOut(): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return "Não foi possível sair agora. Tente novamente.";
  }

  redirect("/admin/login");
}
