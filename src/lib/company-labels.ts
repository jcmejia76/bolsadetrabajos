import { CompanyStatus } from "@/generated/prisma/enums";

export const COMPANY_STATUS_LABELS: Record<string, string> = {
  [CompanyStatus.PENDIENTE]: "Pendiente",
  [CompanyStatus.APROBADA]: "Aprobada",
  [CompanyStatus.RECHAZADA]: "Rechazada",
  [CompanyStatus.SUSPENDIDA]: "Suspendida",
};

export const COMPANY_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [CompanyStatus.PENDIENTE]: "outline",
  [CompanyStatus.APROBADA]: "default",
  [CompanyStatus.RECHAZADA]: "destructive",
  [CompanyStatus.SUSPENDIDA]: "secondary",
};
