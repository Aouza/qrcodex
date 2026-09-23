import "server-only";

import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export type AdminCategoryDetails = {
  id: string;
  name: string;
  slug: string;
  position: number;
  active: boolean;
  imageUrl: string | null;
};

export async function loadAdminCategories(): Promise<AdminCategoryDetails[] | null> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, position, active, image_url")
    .eq("establishment_id", access.establishment.id)
    .order("position")
    .order("id");

  if (error) throw new Error("Failed to load admin categories.");
  return (data ?? []).map((category) => ({ ...category, imageUrl: category.image_url }));
}

export async function loadAdminCategory(categoryId: string): Promise<AdminCategoryDetails | null | undefined> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return undefined;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, position, active, image_url")
    .eq("id", categoryId)
    .eq("establishment_id", access.establishment.id)
    .maybeSingle();

  if (error) throw new Error("Failed to load admin category.");
  return data ? { ...data, imageUrl: data.image_url } : null;
}
