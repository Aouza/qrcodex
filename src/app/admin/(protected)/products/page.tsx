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
  searchParams: Promise<{ created?: string }>;
}) {
  const catalog = await loadAdminProducts();
  if (!catalog) return null;
  const created = (await searchParams).created === "1";

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
      {created && <p className="admin-products__success" role="status">Produto criado com sucesso.</p>}
      <AdminProductList {...catalog} />
    </>
  );
}
