import "server-only";

import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export type AdminCategory = { id: string; name: string; active: boolean };

export type AdminProduct = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  priceCents: number;
  available: boolean;
  active: boolean;
};

export type AdminProductCatalog = {
  categories: AdminCategory[];
  products: AdminProduct[];
};

export async function loadAdminProductCategories(): Promise<AdminCategory[] | null> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, active, position")
    .eq("establishment_id", access.establishment.id)
    .eq("active", true)
    .order("position")
    .order("id");

  if (error) throw new Error("Failed to load product categories.");
  return (data ?? []).map(({ id, name, active }) => ({ id, name, active }));
}

export async function loadAdminProducts(): Promise<AdminProductCatalog | null> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;

  const supabase = await createClient();
  const [categoryResult, productResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, active, position")
      .eq("establishment_id", access.establishment.id)
      .order("position")
      .order("id"),
    supabase
      .from("products")
      .select("id, category_id, name, price_cents, available, active, position")
      .eq("establishment_id", access.establishment.id)
      .order("position")
      .order("id"),
  ]);

  if (categoryResult.error || productResult.error) {
    throw new Error("Failed to load admin products.");
  }

  const categories: AdminCategory[] = (categoryResult.data ?? []).map(
    ({ id, name, active }) => ({ id, name, active }),
  );
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );
  const products: AdminProduct[] = (productResult.data ?? []).map((product) => ({
    id: product.id,
    categoryId: product.category_id,
    categoryName: categoryNames.get(product.category_id) ?? "Categoria indisponível",
    name: product.name,
    priceCents: product.price_cents,
    available: product.available,
    active: product.active,
  }));

  return { categories, products };
}
