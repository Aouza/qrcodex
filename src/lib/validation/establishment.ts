import { z } from "zod";

const instagramPattern = /^@?[a-zA-Z0-9._]{1,30}$/;

export const establishmentSettingsSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(100, "Use no máximo 100 caracteres."),
  instagram: z.string().trim().max(31, "Use no máximo 30 caracteres além de @.").refine((value) => !value || instagramPattern.test(value), "Informe somente o usuário do Instagram.").transform((value) => value ? value.replace(/^@/, "") : null),
  whatsapp: z.string().trim().transform((value) => value.replace(/\D/g, "")).refine((value) => !value || (value.length >= 10 && value.length <= 15), "Informe DDD e número; inclua o código do país quando necessário.").transform((value) => value || null),
});
