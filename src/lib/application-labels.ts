import {
  SendIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  XCircleIcon,
  CheckCircleIcon,
  type LucideIcon,
} from "lucide-react";
import { ApplicationStatus } from "@/generated/prisma/enums";

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  [ApplicationStatus.RECIBIDA]: "Recibida",
  [ApplicationStatus.EN_REVISION]: "En revisión",
  [ApplicationStatus.VISTA]: "Vista",
  [ApplicationStatus.PRESELECCIONADO]: "Preseleccionado",
  [ApplicationStatus.ENTREVISTA]: "Entrevista",
  [ApplicationStatus.RECHAZADO]: "Rechazado",
  [ApplicationStatus.CONTRATADO]: "Contratado",
};

export const APPLICATION_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [ApplicationStatus.RECIBIDA]: "outline",
  [ApplicationStatus.EN_REVISION]: "secondary",
  [ApplicationStatus.VISTA]: "secondary",
  [ApplicationStatus.PRESELECCIONADO]: "secondary",
  [ApplicationStatus.ENTREVISTA]: "secondary",
  [ApplicationStatus.RECHAZADO]: "destructive",
  [ApplicationStatus.CONTRATADO]: "default",
};

/** Icon shown on each step of the candidate-facing application timeline. */
export const APPLICATION_STATUS_ICONS: Record<string, LucideIcon> = {
  [ApplicationStatus.RECIBIDA]: SendIcon,
  [ApplicationStatus.EN_REVISION]: ClockIcon,
  [ApplicationStatus.VISTA]: EyeIcon,
  [ApplicationStatus.PRESELECCIONADO]: StarIcon,
  [ApplicationStatus.ENTREVISTA]: UsersIcon,
  [ApplicationStatus.RECHAZADO]: XCircleIcon,
  [ApplicationStatus.CONTRATADO]: CheckCircleIcon,
};

/** Short default description for a timeline step when the company didn't leave a note. */
export const APPLICATION_STATUS_DESCRIPTIONS: Record<string, string> = {
  [ApplicationStatus.RECIBIDA]: "Tu postulación fue enviada a la empresa.",
  [ApplicationStatus.EN_REVISION]: "La empresa está revisando tu perfil y tu CV.",
  [ApplicationStatus.VISTA]: "La empresa vio tu postulación.",
  [ApplicationStatus.PRESELECCIONADO]: "Fuiste preseleccionado para continuar en el proceso.",
  [ApplicationStatus.ENTREVISTA]: "La empresa quiere entrevistarte.",
  [ApplicationStatus.RECHAZADO]: "La empresa decidió no continuar con tu postulación.",
  [ApplicationStatus.CONTRATADO]: "¡Felicidades! La empresa te contrató para este puesto.",
};
