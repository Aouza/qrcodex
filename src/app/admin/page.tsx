import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

export const metadata: Metadata = {
  title: "Administração | Relica's",
};

export default async function AdminPage() {
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
    <AuthShell
      eyebrow="Acesso confirmado"
      title={access.establishment.name}
      description="Sua sessão e seu vínculo com o estabelecimento foram confirmados."
      footerHref="/relicas"
      footerLabel="Ver cardápio"
    >
      <p className="admin-auth__notice" role="status">
        O painel administrativo será construído na próxima etapa.
      </p>
      <Link href="/admin/login" className="admin-access__session-link">
        Gerenciar sessão
      </Link>
    </AuthShell>
  );
}
