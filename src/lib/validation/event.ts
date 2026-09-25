import { z } from "zod";

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function localDateTimeToIso(value: string) {
  if (!dateTimePattern.test(value)) return null;
  const date = new Date(`${value}:00-03:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

const optionalText = (limit: number) => z.string().trim().max(limit).transform((value) => value || null);

export const eventSchema = z.object({
  title: z.string().trim().min(2, "Informe um título com pelo menos 2 caracteres.").max(120, "Use no máximo 120 caracteres."),
  description: optionalText(1200),
  startsAt: z.string().trim().refine((value) => localDateTimeToIso(value) !== null, "Informe uma data e horário válidos."),
  endsAt: z.string().trim(),
  externalUrl: z.string().trim().max(500).refine((value) => {
    if (!value) return true;
    try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
  }, "Informe um link HTTP ou HTTPS válido."),
  active: z.boolean(),
}).superRefine((value, context) => {
  if (!value.endsAt) return;
  const start = localDateTimeToIso(value.startsAt);
  const end = localDateTimeToIso(value.endsAt);
  if (!end) context.addIssue({ code: "custom", path: ["endsAt"], message: "Informe uma data e horário válidos." });
  else if (start && end < start) context.addIssue({ code: "custom", path: ["endsAt"], message: "O término não pode ser anterior ao início." });
});

export function parseEventInput(input: unknown) {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return parsed;
  return {
    ...parsed,
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      starts_at: localDateTimeToIso(parsed.data.startsAt)!,
      ends_at: parsed.data.endsAt ? localDateTimeToIso(parsed.data.endsAt) : null,
      external_url: parsed.data.externalUrl || null,
      active: parsed.data.active,
    },
  };
}

export function formatEventDateTimeInput(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value)).replace(" ", "T");
}
