import { CVStatus, CVSourceType } from "@/generated/prisma/enums";

export const GENDER_OPTIONS = ["Masculino", "Femenino", "Otro", "Prefiero no decir"] as const;

export const AVAILABILITY_OPTIONS = [
  "Inmediata",
  "1 semana",
  "2 semanas",
  "1 mes",
  "Más de 1 mes",
] as const;

export const CV_STATUS_LABELS: Record<string, string> = {
  [CVStatus.PENDIENTE]: "Pendiente",
  [CVStatus.APROBADO]: "Aprobado",
  [CVStatus.RECHAZADO]: "Rechazado",
  [CVStatus.CAMBIOS_SOLICITADOS]: "Cambios solicitados",
};

export const CV_SOURCE_LABELS: Record<string, string> = {
  [CVSourceType.UPLOAD]: "Subido",
  [CVSourceType.BUILDER]: "Generado",
};
