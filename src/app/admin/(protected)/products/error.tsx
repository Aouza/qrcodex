"use client";

import contentStyles from "@/components/admin/admin-content.module.css";
import productStyles from "@/components/admin/admin-products.module.css";

export default function AdminProductsError({ reset }: { reset: () => void }) {
  return (
    <>
      <header className={contentStyles.heading}>
        <p className={contentStyles.eyebrow}>Cardápio</p>
        <h1>Produtos</h1>
        <p>Não foi possível carregar os itens agora.</p>
      </header>
      <section className={productStyles.noResults} role="alert">
        <h2>Falha ao carregar produtos</h2>
        <p>Tente novamente em alguns instantes.</p>
        <button type="button" onClick={reset}>Tentar novamente</button>
      </section>
    </>
  );
}
