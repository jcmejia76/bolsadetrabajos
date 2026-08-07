import { prisma } from "@/lib/prisma";
import { getStorageService, keyFromUrl, validateFile } from "@/services/storage";

export type MaintenanceState = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
};

export type SiteBranding = {
  logoUrl: string | null;
  faviconUrl: string | null;
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

export async function getSiteBranding(): Promise<SiteBranding> {
  const settings = await prisma.siteSettings.findFirst();
  return { logoUrl: settings?.logoUrl ?? null, faviconUrl: settings?.faviconUrl ?? null };
}

async function getOrCreateSettings() {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) return existing;
  return prisma.siteSettings.create({ data: {} });
}

export async function updateSiteLogo(
  file: { buffer: Buffer; originalName: string; mimeType: string },
  adminId: string
) {
  validateFile(
    { mimeType: file.mimeType, sizeBytes: file.buffer.byteLength, buffer: file.buffer, originalName: file.originalName },
    "image",
    2
  );

  const settings = await getOrCreateSettings();
  const storage = getStorageService();
  const result = await storage.upload({ ...file, folder: "site" });

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: { logoUrl: result.url, updatedById: adminId },
  });

  if (settings.logoUrl) await storage.delete(keyFromUrl(settings.logoUrl)).catch(() => undefined);
  return result.url;
}

export async function removeSiteLogo(adminId: string) {
  const settings = await getOrCreateSettings();
  if (!settings.logoUrl) return;

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: { logoUrl: null, updatedById: adminId },
  });
  await getStorageService()
    .delete(keyFromUrl(settings.logoUrl))
    .catch(() => undefined);
}

export async function updateSiteFavicon(
  file: { buffer: Buffer; originalName: string; mimeType: string },
  adminId: string
) {
  validateFile(
    { mimeType: file.mimeType, sizeBytes: file.buffer.byteLength, buffer: file.buffer, originalName: file.originalName },
    "image",
    1
  );

  const settings = await getOrCreateSettings();
  const storage = getStorageService();
  const result = await storage.upload({ ...file, folder: "site" });

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: { faviconUrl: result.url, updatedById: adminId },
  });

  if (settings.faviconUrl) await storage.delete(keyFromUrl(settings.faviconUrl)).catch(() => undefined);
  return result.url;
}

export async function removeSiteFavicon(adminId: string) {
  const settings = await getOrCreateSettings();
  if (!settings.faviconUrl) return;

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: { faviconUrl: null, updatedById: adminId },
  });
  await getStorageService()
    .delete(keyFromUrl(settings.faviconUrl))
    .catch(() => undefined);
}
