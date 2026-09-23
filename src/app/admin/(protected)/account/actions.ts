"use server";

import type { AccountPasswordState } from "@/lib/admin/account-password-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validation/account-password";

export async function changePassword(
  _state: AccountPasswordState,
  formData: FormData,
): Promise<AccountPasswordState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized" || !access.email) {
    return { formError: "Sua sessão não permite alterar a senha." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      formError: "Revise os campos indicados.",
      fieldErrors: {
        currentPassword: errors.currentPassword?.[0],
        newPassword: errors.newPassword?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: access.email,
    password: parsed.data.currentPassword,
  });

  if (signInError) {
    return {
      formError: "Não foi possível confirmar sua identidade.",
      fieldErrors: { currentPassword: "A senha atual está incorreta." },
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return {
      formError:
        updateError.code === "weak_password"
          ? "A nova senha não atende aos requisitos de segurança."
          : "Não foi possível alterar a senha agora. Tente novamente.",
    };
  }

  const { error: signOutError } = await supabase.auth.signOut({ scope: "others" });

  return {
    success: signOutError
      ? "Senha alterada. Algumas sessões antigas podem permanecer ativas até expirarem."
      : "Senha alterada e outras sessões encerradas com sucesso.",
  };
}
