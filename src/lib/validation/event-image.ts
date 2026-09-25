export const EVENT_IMAGE_BUCKET = "event-images";
export const EVENT_IMAGE_MAX_BYTES = 768 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type EventImageValidation =
  | { ok: true; extension: string }
  | { ok: false; error: string };

export function validateEventImage(file: File): EventImageValidation {
  if (file.size === 0) return { ok: false, error: "Selecione um flyer ou banner." };
  const extension = extensions[file.type];
  if (!extension) return { ok: false, error: "Use uma imagem JPEG, PNG ou WebP." };
  if (file.size > EVENT_IMAGE_MAX_BYTES) {
    return { ok: false, error: "A imagem deve ter no máximo 768 KB." };
  }
  return { ok: true, extension };
}

export function getEventImagePath(imageUrl: string | null, supabaseUrl: string) {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const projectUrl = new URL(supabaseUrl);
    const prefix = `/storage/v1/object/public/${EVENT_IMAGE_BUCKET}/`;
    if (url.origin !== projectUrl.origin || !url.pathname.startsWith(prefix)) return null;
    return decodeURIComponent(url.pathname.slice(prefix.length));
  } catch {
    return null;
  }
}
