"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import type { ProductFormState } from "@/lib/admin/product-form-state";
import { createClient } from "@/lib/supabase/server";
import { createProductSchema, parseBrlToCents } from "@/lib/validation/product";

export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { formError: "Sua sessão não permite criar produtos." };
  }

  const parsed = createProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      formError: "Revise os campos indicados.",
      fieldErrors: {
        name: errors.name?.[0],
        description: errors.description?.[0],
        price: errors.price?.[0],
        categoryId: errors.categoryId?.[0],
      },
    };
  }

  const priceCents = parseBrlToCents(parsed.data.price);
  if (priceCents === null) {
    return { fieldErrors: { price: "Informe um preço válido, como 19,90." } };
  }

  const supabase = await createClient();
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", parsed.data.categoryId)
    .eq("establishment_id", access.establishment.id)
    .eq("active", true)
    .maybeSingle();

  if (categoryError) {
    return { formError: "Não foi possível validar a categoria agora." };
  }
  if (!category) {
    return { fieldErrors: { categoryId: "Selecione uma categoria ativa deste estabelecimento." } };
  }

  const { error: insertError } = await supabase.from("products").insert({
    establishment_id: access.establishment.id,
    category_id: category.id,
    name: parsed.data.name,
    description: parsed.data.description,
    price_cents: priceCents,
    available: parsed.data.available,
    featured: parsed.data.featured,
    active: parsed.data.active,
  });

  if (insertError) {
    return { formError: "Não foi possível criar o produto agora. Tente novamente." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/${access.establishment.slug}`);
  redirect("/admin/products?created=1");
}
