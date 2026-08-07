import { SupportRequestStatus } from "@/generated/prisma/enums";

export const SUPPORT_STATUS_LABELS: Record<string, string> = {
  [SupportRequestStatus.ABIERTO]: "Abierto",
  [SupportRequestStatus.EN_PROCESO]: "En proceso",
  [SupportRequestStatus.RESUELTO]: "Resuelto",
  [SupportRequestStatus.CERRADO]: "Cerrado",
};

export const SUPPORT_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [SupportRequestStatus.ABIERTO]: "destructive",
  [SupportRequestStatus.EN_PROCESO]: "secondary",
  [SupportRequestStatus.RESUELTO]: "default",
  [SupportRequestStatus.CERRADO]: "outline",
};
