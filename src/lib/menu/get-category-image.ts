const relicasCategoryImages: Record<string, string> = {
  porcoes: "/images/categories/porcoes.webp",
  lanches: "/images/categories/lanches.webp",
  bebidas: "/images/categories/bebidas.webp",
  "drinks-e-doses": "/images/categories/drinks-e-doses.webp",
  cachacas: "/images/categories/cachacas.webp",
  cervejas: "/images/categories/cervejas.webp",
  caipirinhas: "/images/categories/caipirinhas.webp",
  vinhos: "/images/categories/vinhos.webp",
  whiskies: "/images/categories/whiskies.webp",
};

export function getCategoryImage(imageUrl: string | null, categorySlug: string, establishmentSlug: string) {
  if (imageUrl) return imageUrl;
  if (establishmentSlug === "relicas") return relicasCategoryImages[categorySlug] ?? "/images/categories/generic.webp";
  return "/images/categories/generic.webp";
}
