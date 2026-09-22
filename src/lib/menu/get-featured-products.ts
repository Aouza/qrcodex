import type { PublicProduct } from "./load-public-menu";

export function getFeaturedProducts(
  categories: ReadonlyArray<{ products: ReadonlyArray<PublicProduct> }>,
): PublicProduct[] {
  return categories.flatMap((category) =>
    category.products.filter((product) => product.featured),
  );
}
