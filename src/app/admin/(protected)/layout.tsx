import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AuthShell } from "@/components/admin/auth-shell";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "not_configured") {
    return (
      <AuthShell
        eyebrow="Acesso administrativo"
        title="Acesso não configurado"
        description={<>A conta <strong>{access.email}</strong> ainda não pertence a um estabelecimento.</>}
        footerHref="/admin/login"
        footerLabel="Gerenciar sessão"
      />
    );
  }

  if (access.status === "selection_required") {
    return (
      <AuthShell
        eyebrow="Acesso administrativo"
        title="Mais de um estabelecimento"
        description="A seleção de estabelecimento ainda não faz parte do MVP. Nenhum dado foi carregado."
        footerHref="/admin/login"
        footerLabel="Gerenciar sessão"
      />
    );
  }

  if (access.status === "unavailable") {
    return (
      <AuthShell
        eyebrow="Acesso administrativo"
        title="Acesso indisponível"
        description="Não foi possível confirmar seu estabelecimento agora. Tente novamente."
        footerHref="/admin/login"
        footerLabel="Gerenciar sessão"
      />
    );
  }

  return (
    <AdminShell establishment={access.establishment} email={access.email}>
      {children}
    </AdminShell>
  );
}
