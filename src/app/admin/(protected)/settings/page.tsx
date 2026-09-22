import type { Metadata } from "next";
import { PendingAdminPage } from "@/components/admin/pending-admin-page";

export const metadata: Metadata = {
  title: "Configurações | Administração",
};

export default function AdminSettingsPage() {
  return (
    <PendingAdminPage
      eyebrow="Estabelecimento"
      title="Configurações"
      description="Mantenha os dados públicos do estabelecimento atualizados."
      nextStep="As configurações básicas estarão disponíveis em uma próxima versão."
    />
  );
}
