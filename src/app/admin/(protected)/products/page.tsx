import type { Metadata } from "next";
import Link from "next/link";
import { AdminProductList } from "@/components/admin/admin-product-list";
import styles from "@/components/admin/admin-content.module.css";
import { loadAdminProducts } from "@/lib/admin/load-admin-products";

export const metadata: Metadata = {
  title: "Produtos | Administração",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; edited?: string; deleted?: string }>;
}) {
  const catalog = await loadAdminProducts();
  if (!catalog) return null;
  const query = await searchParams;
  const successMessage = query.created === "1"
    ? "Produto criado com sucesso."
    : query.edited === "1"
      ? "Produto atualizado com sucesso."
      : query.deleted === "1"
        ? "Produto excluído permanentemente."
      : null;

  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Cardápio</p>
        <h1>Produtos</h1>
        <p>Consulte itens, preços e status do estabelecimento.</p>
      </header>
      <div className="admin-products__toolbar">
        <Link href="/admin/products/new">Novo produto</Link>
      </div>
      {successMessage && <p className="admin-products__success" role="status">{successMessage}</p>}
      <AdminProductList {...catalog} />
    </>
  );
}
