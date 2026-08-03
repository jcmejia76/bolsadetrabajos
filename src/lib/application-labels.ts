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
