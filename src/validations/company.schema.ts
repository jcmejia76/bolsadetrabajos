import { z } from "zod";

export const companyProfileSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  industry: z.string().trim().max(100).optional().or(z.literal("")),
  size: z.string().trim().max(50).optional().or(z.literal("")),
  website: z.url().optional().or(z.literal("")),
  email: z.email("Correo inválido"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  contactName: z.string().trim().max(150).optional().or(z.literal("")),
  contactEmail: z.email().optional().or(z.literal("")),
  contactPhone: z.string().trim().max(30).optional().or(z.literal("")),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
