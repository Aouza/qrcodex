import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/admin/admin-content.module.css";

export const metadata: Metadata = {
  title: "Administração | Relica's",
};

const actions = [
  {
    href: "/admin/products",
    title: "Produtos",
    description: "Gerencie itens, preços e disponibilidade.",
  },
  {
    href: "/admin/categories",
    title: "Categorias",
    description: "Organize as seções exibidas no cardápio.",
  },
  {
    href: "/admin/settings",
    title: "Configurações",
    description: "Atualize as informações do estabelecimento.",
  },
];

export default function AdminPage() {
  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Painel administrativo</p>
        <h1>Visão geral</h1>
        <p>Escolha uma área para começar a manter seu cardápio atualizado.</p>
      </header>

      <div className={styles.actions}>
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className={styles.action}>
            <span>
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.status}>
        <strong>Cardápio público disponível</strong>
        <p>O endereço usado pelo QR Code permanece o mesmo quando o conteúdo do cardápio muda.</p>
      </div>
    </>
  );
}
