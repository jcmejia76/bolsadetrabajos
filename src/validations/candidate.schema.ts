import { z } from "zod";
import { LanguageLevel } from "@/generated/prisma/enums";

export const workExperienceSchema = z
  .object({
    company: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
    position: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine((d) => d.isCurrent || (d.endDate && d.endDate >= d.startDate), {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["endDate"],
  });

export const educationSchema = z
  .object({
    institution: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
    degree: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
    fieldOfStudy: z.string().trim().max(150).optional().or(z.literal("")),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isCurrent: z.boolean().default(false),
  })
  .refine((d) => d.isCurrent || !d.startDate || !d.endDate || d.endDate >= d.startDate, {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["endDate"],
  });

export const certificationSchema = z
  .object({
    name: z.string().trim().min(2, "Mínimo 2 caracteres").max(150),
    issuer: z.string().trim().max(150).optional().or(z.literal("")),
    issuedAt: z.coerce.date().nullable().optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    credentialUrl: z.url().optional().or(z.literal("")),
  })
  .refine((d) => !d.issuedAt || !d.expiresAt || d.expiresAt >= d.issuedAt, {
    message: "La fecha de expiración debe ser posterior a la de emisión",
    path: ["expiresAt"],
  });

export const candidateLanguageSchema = z.object({
  language: z.string().trim().min(2, "Mínimo 2 caracteres").max(40),
  level: z.enum(LanguageLevel),
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Requerido").max(30),
  url: z.url(),
});

export const referenceSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  relationship: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.email().optional().or(z.literal("")),
});

export const candidateProfileSchema = z
  .object({
    firstName: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
    lastName: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    address: z.string().trim().max(200).optional().or(z.literal("")),
    birthDate: z.coerce.date().nullable().optional(),
    gender: z.string().trim().max(40).optional().or(z.literal("")),
    nationality: z.string().trim().max(80).optional().or(z.literal("")),
    aboutMe: z.string().trim().max(3000).optional().or(z.literal("")),
    profession: z.string().trim().max(150).optional().or(z.literal("")),
    availability: z.string().trim().max(60).optional().or(z.literal("")),
    salaryAspiration: z.coerce.number().nonnegative().nullable().optional(),
    portfolioUrl: z.url().optional().or(z.literal("")),
    isProfilePublic: z.boolean().default(true),
    skills: z
      .array(z.string().trim().min(1).max(40))
      .max(30, "Máximo 30 habilidades")
      .default([])
      .transform((arr) => Array.from(new Set(arr.map((s) => s.trim()))).filter(Boolean)),
    socialLinks: z.array(socialLinkSchema).max(6, "Máximo 6 redes sociales").default([]),
    references: z.array(referenceSchema).max(5, "Máximo 5 referencias").default([]),
    workExperiences: z.array(workExperienceSchema).max(20).default([]),
    educations: z.array(educationSchema).max(15).default([]),
    certifications: z.array(certificationSchema).max(15).default([]),
    languages: z.array(candidateLanguageSchema).max(10).default([]),
  })
  .refine((d) => !d.birthDate || d.birthDate < new Date(), {
    message: "La fecha de nacimiento debe ser en el pasado",
    path: ["birthDate"],
  });

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;
/** Raw shape react-hook-form manages client-side, before zod coercion/transforms run. */
export type CandidateProfileFormValues = z.input<typeof candidateProfileSchema>;
