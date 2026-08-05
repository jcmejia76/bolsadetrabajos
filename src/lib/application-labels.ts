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
