import { z } from "zod";
import { SupportRequestStatus } from "@/generated/prisma/enums";

export const supportRequestSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  email: z.email("Correo inválido"),
  subject: z.string().trim().min(1, "El asunto es obligatorio").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Describe el problema con más detalle (mínimo 10 caracteres)")
    .max(4000),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;

export const updateSupportRequestStatusSchema = z.object({
  status: z.enum(SupportRequestStatus),
  adminNote: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type UpdateSupportRequestStatusInput = z.infer<typeof updateSupportRequestStatusSchema>;
