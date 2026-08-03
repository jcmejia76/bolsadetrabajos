import {
  JobModalidad,
  JobJornada,
  ExperienceLevel,
  AcademicLevel,
  LanguageLevel,
  JobStatus,
} from "@/generated/prisma/enums";

export const MODALIDAD_LABELS: Record<string, string> = {
  [JobModalidad.PRESENCIAL]: "Presencial",
  [JobModalidad.REMOTO]: "Remoto",
  [JobModalidad.HIBRIDO]: "Híbrido",
};

export const JORNADA_LABELS: Record<string, string> = {
  [JobJornada.TIEMPO_COMPLETO]: "Tiempo completo",
  [JobJornada.MEDIO_TIEMPO]: "Medio tiempo",
  [JobJornada.TEMPORAL]: "Temporal",
  [JobJornada.FREELANCE]: "Freelance",
  [JobJornada.PASANTIA]: "Pasantía",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  [ExperienceLevel.SIN_EXPERIENCIA]: "Sin experiencia",
  [ExperienceLevel.JUNIOR]: "Junior",
  [ExperienceLevel.SEMI_SENIOR]: "Semi-senior",
  [ExperienceLevel.SENIOR]: "Senior",
  [ExperienceLevel.GERENCIAL]: "Gerencial",
  [ExperienceLevel.DIRECTIVO]: "Directivo",
};

export const ACADEMIC_LABELS: Record<string, string> = {
  [AcademicLevel.SECUNDARIA]: "Secundaria",
  [AcademicLevel.TECNICO]: "Técnico",
  [AcademicLevel.UNIVERSITARIO_EN_CURSO]: "Universitario en curso",
  [AcademicLevel.UNIVERSITARIO_GRADUADO]: "Universitario graduado",
  [AcademicLevel.POSTGRADO]: "Postgrado",
  [AcademicLevel.MAESTRIA]: "Maestría",
  [AcademicLevel.DOCTORADO]: "Doctorado",
};

export const LANGUAGE_LEVEL_LABELS: Record<string, string> = {
  [LanguageLevel.BASICO]: "Básico",
  [LanguageLevel.INTERMEDIO]: "Intermedio",
  [LanguageLevel.AVANZADO]: "Avanzado",
  [LanguageLevel.NATIVO]: "Nativo",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  [JobStatus.BORRADOR]: "Borrador",
  [JobStatus.PENDIENTE_APROBACION]: "Pendiente de aprobación",
  [JobStatus.APROBADA]: "Aprobada",
  [JobStatus.RECHAZADA]: "Rechazada",
  [JobStatus.CAMBIOS_SOLICITADOS]: "Cambios solicitados",
  [JobStatus.PUBLICADA]: "Publicada",
  [JobStatus.CERRADA]: "Cerrada",
  [JobStatus.EXPIRADA]: "Expirada",
};

export const JOB_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [JobStatus.BORRADOR]: "secondary",
  [JobStatus.PENDIENTE_APROBACION]: "outline",
  [JobStatus.APROBADA]: "default",
  [JobStatus.RECHAZADA]: "destructive",
  [JobStatus.CAMBIOS_SOLICITADOS]: "secondary",
  [JobStatus.PUBLICADA]: "default",
  [JobStatus.CERRADA]: "outline",
  [JobStatus.EXPIRADA]: "outline",
};
