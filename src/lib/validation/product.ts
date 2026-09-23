import { z } from "zod";

const pricePattern = /^\d{1,6}(?:[,.]\d{1,2})?$/;

export function parseBrlToCents(value: string) {
  const normalized = value.trim();
  if (!pricePattern.test(normalized)) return null;

  const [whole, fraction = ""] = normalized.replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function formatCentsForInput(priceCents: number) {
  const whole = Math.floor(priceCents / 100);
  const fraction = String(priceCents % 100).padStart(2, "0");
  return `${whole},${fraction}`;
}

export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(120, "Use no máximo 120 caracteres."),
  description: z.string().trim().max(500, "Use no máximo 500 caracteres.").transform((value) => value || null),
  price: z.string().trim().refine((value) => parseBrlToCents(value) !== null, "Informe um preço válido, como 19,90."),
  categoryId: z.uuid("Selecione uma categoria válida."),
  available: z.boolean(),
  featured: z.boolean(),
  active: z.boolean(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
