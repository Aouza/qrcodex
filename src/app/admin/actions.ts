"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut(): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return "Não foi possível sair agora. Tente novamente.";
  }

  redirect("/admin/login");
}
