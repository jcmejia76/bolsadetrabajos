import { StaffStatus } from "@/generated/prisma/enums";

export const STAFF_STATUS_LABELS: Record<string, string> = {
  [StaffStatus.INVITADO]: "Invitación pendiente",
  [StaffStatus.ACTIVO]: "Activo",
  [StaffStatus.SUSPENDIDO]: "Suspendido",
  [StaffStatus.ELIMINADO]: "Eliminado",
};

export const STAFF_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [StaffStatus.INVITADO]: "outline",
  [StaffStatus.ACTIVO]: "default",
  [StaffStatus.SUSPENDIDO]: "secondary",
  [StaffStatus.ELIMINADO]: "destructive",
};
