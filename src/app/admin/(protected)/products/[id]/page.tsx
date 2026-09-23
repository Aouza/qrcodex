import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/create-product-form";
import { DeleteProductForm } from "@/components/admin/delete-product-form";
import { ProductImageForm } from "@/components/admin/product-image-form";
import styles from "@/components/admin/admin-content.module.css";
import { loadAdminProductForEdit } from "@/lib/admin/load-admin-products";
import { updateProduct } from "./actions";

export const metadata: Metadata = {
  title: "Editar produto | Administração",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadAdminProductForEdit(id);
  if (!result) return null;
  if (!result.product) notFound();

  const action = updateProduct.bind(null, result.product.id);

  return (
    <>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Cardápio</p>
        <h1>Editar produto</h1>
        <p>Atualize as informações exibidas no cardápio.</p>
      </header>
      <ProductForm
        action={action}
        categories={result.categories}
        submitLabel="Salvar alterações"
        values={result.product}
      />
      <ProductImageForm
        productId={result.product.id}
        productName={result.product.name}
        imageUrl={result.product.imageUrl}
      />
      <DeleteProductForm productId={result.product.id} productName={result.product.name} />
    </>
  );
}
