import { createPublicClient } from "@/lib/supabase/public";

export type PublicProduct = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  position: number;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  position: number;
  products: PublicProduct[];
};

export async function loadPublicMenu(slug: string) {
  const supabase = createPublicClient();
  const { data: establishment, error: establishmentError } = await supabase
    .from("establishments")
    .select("id, name, slug, logo_url, instagram, whatsapp")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (establishmentError) {
    throw new Error("Failed to load the public menu.");
  }
  if (!establishment) {
    return null;
  }

  const [categoryResult, productResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, position")
      .eq("establishment_id", establishment.id)
      .eq("active", true)
      .order("position")
      .order("id"),
    supabase
      .from("products")
      .select(
        "id, category_id, name, description, price_cents, image_url, available, featured, position",
      )
      .eq("establishment_id", establishment.id)
      .eq("active", true)
      .order("position")
      .order("id"),
  ]);

  if (categoryResult.error || productResult.error) {
    throw new Error("Failed to load the public menu.");
  }

  const productsByCategory = new Map<string, PublicProduct[]>();
  for (const product of productResult.data ?? []) {
    const products = productsByCategory.get(product.category_id) ?? [];
    products.push(product);
    productsByCategory.set(product.category_id, products);
  }

  const categories: PublicCategory[] = (categoryResult.data ?? []).map((category) => ({
      ...category,
      products: productsByCategory.get(category.id) ?? [],
    }));

  return { establishment, categories };
}
