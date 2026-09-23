export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_MAX_BYTES = 768 * 1024;

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type ProductImageValidation =
  | { ok: true; extension: string }
  | { ok: false; error: string };

export function validateProductImage(file: File): ProductImageValidation {
  if (file.size === 0) return { ok: false, error: "Selecione uma imagem." };
  const extension = imageExtensions[file.type];
  if (!extension) {
    return { ok: false, error: "Use uma imagem JPEG, PNG ou WebP." };
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return { ok: false, error: "A imagem deve ter no máximo 768 KB." };
  }
  return { ok: true, extension };
}

export function getProductImagePath(imageUrl: string | null, supabaseUrl: string) {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const projectUrl = new URL(supabaseUrl);
    const prefix = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;
    if (url.origin !== projectUrl.origin || !url.pathname.startsWith(prefix)) return null;
    return decodeURIComponent(url.pathname.slice(prefix.length));
  } catch {
    return null;
  }
}
