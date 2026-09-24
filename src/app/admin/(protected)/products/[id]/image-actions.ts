"use server";

import { revalidatePath } from "next/cache";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import {
  getProductImagePath,
  PRODUCT_IMAGE_BUCKET,
  validateProductImage,
} from "@/lib/validation/product-image";

export type ProductImageState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialError = (message: string): ProductImageState => ({ status: "error", message });

async function loadOwnedProduct(productId: string) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("id, image_url")
    .eq("id", productId)
    .eq("establishment_id", access.establishment.id)
    .maybeSingle();

  if (error || !product) return null;
  return { access, supabase, product };
}

export async function uploadProductImage(
  productId: string,
  _previousState: ProductImageState,
  formData: FormData,
): Promise<ProductImageState> {
  void _previousState;
  const owned = await loadOwnedProduct(productId);
  if (!owned) return initialError("Produto não encontrado para esta conta.");

  const file = formData.get("image");
  if (!(file instanceof File)) return initialError("Selecione uma imagem.");
  const validation = validateProductImage(file);
  if (!validation.ok) return initialError(validation.error);

  const path = `${owned.access.establishment.id}/${owned.product.id}/${crypto.randomUUID()}.${validation.extension}`;
  const { error: uploadError } = await owned.supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return initialError("Não foi possível enviar a imagem agora.");

  const { data: publicData } = owned.supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);
  const { data: updated, error: updateError } = await owned.supabase
    .from("products")
    .update({ image_url: publicData.publicUrl })
    .eq("id", owned.product.id)
    .eq("establishment_id", owned.access.establishment.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    await owned.supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([path]);
    return initialError("Não foi possível vincular a imagem ao produto.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const previousPath = getProductImagePath(owned.product.image_url, supabaseUrl);
  if (previousPath && previousPath !== path) {
    const { error: removeError } = await owned.supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove([previousPath]);

    if (removeError) {
      await owned.supabase
        .from("products")
        .update({ image_url: owned.product.image_url })
        .eq("id", owned.product.id)
        .eq("establishment_id", owned.access.establishment.id);
      await owned.supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([path]);
      return initialError("Não foi possível substituir a imagem anterior.");
    }
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
  revalidatePath(`/${owned.access.establishment.slug}/cardapio`);
  return { status: "success", message: "Imagem atualizada com sucesso." };
}

export async function removeProductImage(
  productId: string,
  _previousState: ProductImageState,
): Promise<ProductImageState> {
  void _previousState;
  const owned = await loadOwnedProduct(productId);
  if (!owned) return initialError("Produto não encontrado para esta conta.");
  if (!owned.product.image_url) return { status: "success", message: "O produto já está sem imagem." };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const previousPath = getProductImagePath(owned.product.image_url, supabaseUrl);
  if (!previousPath) return initialError("A imagem atual não pertence ao armazenamento configurado.");

  const { error: updateError } = await owned.supabase
    .from("products")
    .update({ image_url: null })
    .eq("id", owned.product.id)
    .eq("establishment_id", owned.access.establishment.id);
  if (updateError) return initialError("Não foi possível remover a imagem do produto.");

  const { error: removeError } = await owned.supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([previousPath]);
  if (removeError) {
    await owned.supabase
      .from("products")
      .update({ image_url: owned.product.image_url })
      .eq("id", owned.product.id)
      .eq("establishment_id", owned.access.establishment.id);
    return initialError("Não foi possível remover o arquivo da imagem.");
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
  revalidatePath(`/${owned.access.establishment.slug}/cardapio`);
  return { status: "success", message: "Imagem removida com sucesso." };
}
