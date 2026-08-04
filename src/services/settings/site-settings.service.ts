import { prisma } from "@/lib/prisma";

export type MaintenanceState = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
};

const DEFAULT_STATE: MaintenanceState = { maintenanceMode: false, maintenanceMessage: null };

export async function getMaintenanceState(): Promise<MaintenanceState> {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) return DEFAULT_STATE;
  return {
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  };
}

export async function setMaintenanceMode(enabled: boolean, message: string | null, adminId: string) {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    return prisma.siteSettings.update({
      where: { id: existing.id },
      data: { maintenanceMode: enabled, maintenanceMessage: message, updatedById: adminId },
    });
  }
  return prisma.siteSettings.create({
    data: { maintenanceMode: enabled, maintenanceMessage: message, updatedById: adminId },
  });
}
