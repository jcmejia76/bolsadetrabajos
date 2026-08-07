import { z } from "zod";

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const createContentPageSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(150),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El slug es obligatorio")
    .max(100)
    .regex(slugPattern, "Usa solo minúsculas, números y guiones (ej. politica-de-privacidad)"),
  body: z.string().trim().min(1, "El contenido no puede estar vacío"),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type CreateContentPageInput = z.infer<typeof createContentPageSchema>;

export const updateContentPageSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(150),
  body: z.string().trim().min(1, "El contenido no puede estar vacío"),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type UpdateContentPageInput = z.infer<typeof updateContentPageSchema>;
