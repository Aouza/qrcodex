"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductFormState } from "@/lib/admin/product-form-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { createProductSchema, parseBrlToCents } from "@/lib/validation/product";
import { getProductImagePath, PRODUCT_IMAGE_BUCKET } from "@/lib/validation/product-image";

export async function updateProduct(
  productId: string,
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { formError: "Sua sessão não permite editar produtos." };
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

  if (categoryError) return { formError: "Não foi possível validar a categoria agora." };
  if (!category) {
    return { fieldErrors: { categoryId: "Selecione uma categoria ativa deste estabelecimento." } };
  }

  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      category_id: category.id,
      name: parsed.data.name,
      description: parsed.data.description,
      price_cents: priceCents,
      available: parsed.data.available,
      featured: parsed.data.featured,
      active: parsed.data.active,
    })
    .eq("id", productId)
    .eq("establishment_id", access.establishment.id)
    .select("id")
    .maybeSingle();

  if (updateError) {
    return { formError: "Não foi possível salvar o produto agora. Tente novamente." };
  }
  if (!updatedProduct) {
    return { formError: "Produto não encontrado para este estabelecimento." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/${access.establishment.slug}/cardapio`);
  redirect("/admin/products?edited=1");
}

export type DeleteProductState = {
  error?: string;
};

export async function deleteProduct(
  productId: string,
  _previousState: DeleteProductState,
  formData: FormData,
): Promise<DeleteProductState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    return { error: "Sua sessão não permite excluir produtos." };
  }

  if (formData.get("confirmed") !== "yes") {
    return { error: "Confirme a exclusão antes de continuar." };
  }

  const supabase = await createClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, image_url")
    .eq("id", productId)
    .eq("establishment_id", access.establishment.id)
    .maybeSingle();

  if (productError) {
    return { error: "Não foi possível validar o produto agora." };
  }
  if (!product) {
    return { error: "Produto não encontrado para este estabelecimento." };
  }

  const imagePath = getProductImagePath(
    product.image_url,
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  );
  if (imagePath) {
    const { error: imageError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove([imagePath]);
    if (imageError) return { error: "Não foi possível remover a imagem do produto." };
  }

  const { data: deletedProduct, error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id)
    .eq("establishment_id", access.establishment.id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    if (imagePath) {
      await supabase
        .from("products")
        .update({ image_url: null })
        .eq("id", product.id)
        .eq("establishment_id", access.establishment.id);
    }
    return { error: "Não foi possível excluir o produto agora." };
  }
  if (!deletedProduct) {
    return { error: "Produto não encontrado para este estabelecimento." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/${access.establishment.slug}/cardapio`);
  redirect("/admin/products?deleted=1");
}
