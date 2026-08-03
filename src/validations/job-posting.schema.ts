import { z } from "zod";
import {
  JobModalidad,
  JobJornada,
  ExperienceLevel,
  AcademicLevel,
  LanguageLevel,
} from "@/generated/prisma/enums";

export const jobRequiredLanguageSchema = z.object({
  language: z.string().trim().min(2, "Requerido").max(40),
  level: z.enum(LanguageLevel),
});

export const jobPostingSchema = z
  .object({
    title: z.string().trim().min(5, "Mínimo 5 caracteres").max(150),
    categoryId: z.string().min(1, "Selecciona una categoría"),
    professionalArea: z.string().trim().max(100).optional().or(z.literal("")),
    modalidad: z.enum(JobModalidad),
    jornada: z.enum(JobJornada),
    department: z.string().trim().max(100).optional().or(z.literal("")),
    city: z.string().trim().max(100).optional().or(z.literal("")),
    country: z.string().trim().max(100).optional().or(z.literal("")),
    salaryMin: z.coerce.number().nonnegative().nullable().optional(),
    salaryMax: z.coerce.number().nonnegative().nullable().optional(),
    salaryVisible: z.boolean().default(false),
    description: z.string().trim().min(20, "Mínimo 20 caracteres"),
    responsibilities: z.string().trim().max(5000).optional().or(z.literal("")),
    requirements: z.string().trim().max(5000).optional().or(z.literal("")),
    benefits: z.string().trim().max(5000).optional().or(z.literal("")),
    vacancies: z.coerce.number().int().min(1).max(999).default(1),
    deadline: z.coerce.date().nullable().optional(),
    experienceLevel: z.enum(ExperienceLevel).nullable().optional(),
    academicLevel: z.enum(AcademicLevel).nullable().optional(),
    requiresLicense: z.boolean().default(false),
    requiresOwnVehicle: z.boolean().default(false),
    travelAvailability: z.boolean().default(false),
    keywords: z
      .array(z.string().trim().min(1).max(40))
      .max(15, "Máximo 15 palabras clave")
      .default([])
      .transform((arr) => Array.from(new Set(arr.map((k) => k.trim()))).filter(Boolean)),
    requiredLanguages: z.array(jobRequiredLanguageSchema).max(10).default([]),
  })
  .refine((d) => !d.salaryMin || !d.salaryMax || d.salaryMax >= d.salaryMin, {
    message: "El salario máximo debe ser mayor o igual al mínimo",
    path: ["salaryMax"],
  })
  .refine((d) => !d.deadline || d.deadline > new Date(), {
    message: "La fecha límite debe ser futura",
    path: ["deadline"],
  });

export type JobPostingInput = z.infer<typeof jobPostingSchema>;
/** Raw shape react-hook-form manages client-side, before zod coercion/transforms run. */
export type JobPostingFormValues = z.input<typeof jobPostingSchema>;
