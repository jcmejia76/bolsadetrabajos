import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const registerCandidateSchema = z.object({
  type: z.literal("candidato"),
  firstName: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  lastName: z.string().trim().min(1, "El apellido es obligatorio").max(80),
  email: z.email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const registerCompanySchema = z.object({
  type: z.literal("empresa"),
  companyName: z.string().trim().min(1, "El nombre de la empresa es obligatorio").max(120),
  email: z.email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z.discriminatedUnion("type", [
  registerCandidateSchema,
  registerCompanySchema,
]);

export type RegisterInput = z.infer<typeof registerSchema>;
