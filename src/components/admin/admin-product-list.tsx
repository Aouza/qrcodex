"use client";

import { useMemo, useState } from "react";
import { filterAdminProducts } from "@/lib/admin/filter-admin-products";
import type { AdminCategory, AdminProduct } from "@/lib/admin/load-admin-products";
import styles from "./admin-products.module.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function AdminProductList({
  categories,
  products,
}: {
  categories: AdminCategory[];
  products: AdminProduct[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const visibleProducts = useMemo(
    () => filterAdminProducts(products, query, categoryId),
    [products, query, categoryId],
  );
  const filtering = query.trim().length > 0 || categoryId.length > 0;

  function clearFilters() {
    setQuery("");
    setCategoryId("");
  }

  if (products.length === 0) {
    return (
      <section className={styles.empty} aria-labelledby="empty-products-title">
        <h2 id="empty-products-title">Nenhum produto cadastrado</h2>
        <p>O primeiro produto poderá ser adicionado na próxima etapa.</p>
      </section>
    );
  }

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="admin-product-search">Buscar produto</label>
          <input
            id="admin-product-search"
            type="search"
            placeholder="Nome do produto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-category-filter">Categoria</label>
          <select
            id="admin-category-filter"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}{category.active ? "" : " (inativa)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.summary} aria-live="polite">
        <span>{visibleProducts.length} {visibleProducts.length === 1 ? "produto" : "produtos"}</span>
        {filtering && <button type="button" onClick={clearFilters}>Limpar filtros</button>}
      </div>

      {visibleProducts.length === 0 ? (
        <section className={styles.noResults} aria-live="polite">
          <h2>Nenhum produto encontrado</h2>
          <p>Ajuste a busca ou escolha outra categoria.</p>
          <button type="button" onClick={clearFilters}>Limpar filtros</button>
        </section>
      ) : (
        <ul className={styles.list} aria-label="Produtos">
          {visibleProducts.map((product) => (
            <li key={product.id} className={styles.product}>
              <div className={styles.productMain}>
                <strong>{product.name}</strong>
                <span>{product.categoryName}</span>
              </div>
              <strong className={styles.price}>{currency.format(product.priceCents / 100)}</strong>
              <div className={styles.statuses}>
                <span data-tone={product.available ? "positive" : "warning"}>
                  {product.available ? "Disponível" : "Esgotado"}
                </span>
                <span data-tone={product.active ? "neutral" : "muted"}>
                  {product.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
