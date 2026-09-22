import type { Metadata } from "next";
import { PendingAdminPage } from "@/components/admin/pending-admin-page";

export const metadata: Metadata = {
  title: "Categorias | Administração",
};

export default function AdminCategoriesPage() {
  return (
    <PendingAdminPage
      eyebrow="Organização"
      title="Categorias"
      description="Organize como os produtos aparecem para os clientes."
      nextStep="Criação, edição e ordenação de categorias estarão disponíveis em uma próxima versão."
    />
  );
}
