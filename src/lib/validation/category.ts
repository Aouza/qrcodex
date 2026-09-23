import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(80, "Use no máximo 80 caracteres."),
  slug: z.string().trim().min(2, "Informe um identificador com pelo menos 2 caracteres.").max(80, "Use no máximo 80 caracteres.").regex(slugPattern, "Use apenas letras minúsculas, números e hífens."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
