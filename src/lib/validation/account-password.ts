import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(12, "Use pelo menos 12 caracteres.")
  .max(72, "Use no máximo 72 caracteres.")
  .regex(/[A-Za-zÀ-ÖØ-öø-ÿ]/, "Inclua pelo menos uma letra.")
  .regex(/\d/, "Inclua pelo menos um número.");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "As novas senhas precisam ser iguais.",
      });
    }

    if (value.currentPassword === value.newPassword) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "A nova senha deve ser diferente da senha atual.",
      });
    }
  });
