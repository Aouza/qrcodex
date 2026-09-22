import type { PublicCategory } from "./load-public-menu";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function filterMenuCategories(
  categories: PublicCategory[],
  query: string,
): PublicCategory[] {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return categories;

  return categories.flatMap((category) => {
    const products = category.products.filter((product) =>
      normalizeSearchText(`${product.name} ${product.description ?? ""}`).includes(normalizedQuery),
    );
    return products.length > 0 ? [{ ...category, products }] : [];
  });
}
