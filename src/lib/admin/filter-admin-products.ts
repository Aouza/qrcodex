import type { AdminProduct } from "./load-admin-products";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function filterAdminProducts(
  products: AdminProduct[],
  query: string,
  categoryId: string,
) {
  const normalizedQuery = normalizeSearchText(query.trim());

  return products.filter((product) => {
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    const matchesQuery = !normalizedQuery
      || normalizeSearchText(product.name).includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
