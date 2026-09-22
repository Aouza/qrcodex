import type { Metadata } from "next";
import Link from "next/link";
import { CreateProductForm } from "@/components/admin/create-product-form";
import styles from "@/components/admin/admin-content.module.css";
import { loadAdminProductCategories } from "@/lib/admin/load-admin-products";

export const metadata: Metadata = {
  title: "Novo produto | Administração",
};

export default async function NewProductPage() {
  const categories = await loadAdminProductCategories();
  if (!categories) return null;

  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Cardápio</p>
        <h1>Novo produto</h1>
        <p>Cadastre as informações que serão exibidas no cardápio.</p>
      </header>
      {categories.length > 0 ? (
        <CreateProductForm categories={categories} />
      ) : (
        <div className={styles.pending} role="status">
          <strong>Nenhuma categoria ativa</strong>
          <p>Crie ou ative uma categoria antes de cadastrar um produto.</p>
          <Link href="/admin/categories">Ver categorias</Link>
        </div>
      )}
    </>
  );
}
