"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { productionMusicEnabled } from "@/lib/music/runtime";
import { adminMusicCommand, adminRpcInstruction } from "@/lib/music/admin-protocol";
import type { AdminMusicResult } from "@/lib/music/admin-protocol";

export async function mutateAdminMusic(input: unknown): Promise<AdminMusicResult> {
  const access = await getAdminAccess(); // Independently checked on EVERY action invocation.
  if (access.status !== "authorized") return { error: "Sua sessão não permite gerenciar Música." };
  if (!productionMusicEnabled()) return { error: "Música ainda não está configurada neste ambiente." };
  const parsed = adminMusicCommand.safeParse(input);
  if (!parsed.success) return { error: "Operação inválida. Atualize a tela e tente novamente." };
  const command = parsed.data;
  const instruction = adminRpcInstruction(access.establishment.id, command);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(instruction.name, instruction.args);
    if (error) return { error: "Não foi possível concluir. Verifique sua sessão, os limites ou se a TV já está pareada." };
    revalidatePath("/admin/music");
    revalidatePath(`/${access.establishment.slug}/musicas`);
    if (command.operation === "pair") {
      if (typeof data !== "string" || !/^[a-f0-9]{64}$/.test(data)) return { error: "Não foi possível gerar o código." };
      return { pairingCode: data, message: "Código de uso único, válido por 10 minutos. Insira-o apenas na TV." };
    }
    if ((command.operation === "skip" || command.operation === "remove") && data !== true)
      return { error: "A fila mudou; este pedido não pode mais receber essa operação. Atualize a tela." };
    return { message: "Operação concluída." };
  } catch { return { error: "Música temporariamente indisponível. Atualize antes de tentar novamente." }; }
}
