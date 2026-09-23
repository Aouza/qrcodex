"use client";

import { useMemo, useState } from "react";
import { CategoryNavigation } from "@/components/menu/category-navigation";
import { ProductListItem } from "@/components/menu/product-list-item";
import { filterMenuCategories } from "@/lib/menu/filter-menu-categories";
import { getFeaturedProducts } from "@/lib/menu/get-featured-products";
import type { PublicCategory } from "@/lib/menu/load-public-menu";

export function MenuCatalog({
  categories,
  establishmentSlug,
}: {
  categories: PublicCategory[];
  establishmentSlug: string;
}) {
  const [query, setQuery] = useState("");
  const hasProducts = categories.some((category) => category.products.length > 0);
  const searching = hasProducts && query.trim().length > 0;
  const visibleCategories = useMemo(
    () => filterMenuCategories(categories, query),
    [categories, query],
  );
  const featuredProducts = getFeaturedProducts(visibleCategories);
  const resultCount = visibleCategories.reduce(
    (count, category) => count + category.products.length,
    0,
  );

  return (
    <>
      {hasProducts && (
        <div className="public-menu__inner public-menu__search">
          <label htmlFor="menu-search">Buscar no cardápio</label>
          <div className="public-menu__search-field">
            <input
              id="menu-search"
              type="search"
              placeholder="Buscar cerveja, drink, lanche..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-controls="menu-results"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                Limpar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="public-menu__inner public-menu__intro">
        <h2 id="menu-categories">{searching ? "Resultados" : "Cardápio"}</h2>
        <span aria-live="polite">
          {searching
            ? `${resultCount} ${resultCount === 1 ? "item encontrado" : "itens encontrados"}`
            : `${categories.length} categorias`}
        </span>
      </div>

      {hasProducts && visibleCategories.length > 0 && (
        <CategoryNavigation
          key={visibleCategories.map((category) => category.id).join(":")}
          establishmentSlug={establishmentSlug}
          categories={visibleCategories.map(({ id, name, slug, image_url }) => ({ id, name, slug, image_url }))}
        />
      )}

      {featuredProducts.length > 0 && (
        <section className="public-menu__inner public-menu__featured" aria-labelledby="menu-featured">
          <h2 id="menu-featured">Destaques</h2>
          <ul className="public-menu__featured-products">
            {featuredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} featured />
            ))}
          </ul>
        </section>
      )}

      {!hasProducts ? (
        <section id="menu-results" className="public-menu__inner public-menu__empty-menu" aria-labelledby="menu-empty-title">
          <h3 id="menu-empty-title">
            {categories.length === 0 ? "Cardápio sem categorias" : "Cardápio sem produtos"}
          </h3>
          <p>
            {categories.length === 0
              ? "Nenhuma categoria disponível no momento."
              : "Ainda não há produtos disponíveis neste cardápio."}
          </p>
        </section>
      ) : searching && resultCount === 0 ? (
        <section id="menu-results" className="public-menu__inner public-menu__no-results" aria-live="polite">
          <h3>Nenhum item encontrado</h3>
          <p>Tente outro nome ou descrição.</p>
          <button type="button" onClick={() => setQuery("")}>Limpar busca</button>
        </section>
      ) : (
        <section id="menu-results" className="public-menu__inner public-menu__content" aria-labelledby="menu-categories">
          {visibleCategories.map((category, index) => (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="public-menu__category-section"
              aria-labelledby={`category-title-${category.id}`}
            >
              <div className="public-menu__category-heading">
                <span className="public-menu__category-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 id={`category-title-${category.id}`}>{category.name}</h3>
              </div>
              {category.products.length > 0 ? (
                <ul className="public-menu__products">
                  {category.products.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </ul>
              ) : (
                <p className="public-menu__category-empty">
                  Nenhum item disponível nesta categoria no momento.
                </p>
              )}
            </section>
          ))}
        </section>
      )}
    </>
  );
}
