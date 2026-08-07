"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { maintenanceModeSchema } from "@/validations/site-settings.schema";
import * as siteSettingsService from "@/services/settings/site-settings.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function setMaintenanceModeAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = maintenanceModeSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await siteSettingsService.setMaintenanceMode(parsed.data.enabled, parsed.data.message?.trim() || null, userId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "SET_MAINTENANCE_MODE",
      entityType: "SiteSettings",
      after: { enabled: parsed.data.enabled, message: parsed.data.message?.trim() || null },
      ipAddress,
      userAgent,
    });
    revalidatePath("/admin/configuracion");
    revalidatePath("/", "layout");
    revalidatePath("/empresa", "layout");
    revalidatePath("/candidato", "layout");
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

function revalidateBranding() {
  revalidatePath("/admin/configuracion");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/empresa", "layout");
  revalidatePath("/candidato", "layout");
}

export async function uploadSiteLogoAction(formData: FormData): Promise<ActionResult<{ logoUrl: string }>> {
  try {
    const { userId } = await requireAdminSession();
    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const logoUrl = await siteSettingsService.updateSiteLogo(
      { buffer, originalName: file.name, mimeType: file.type },
      userId
    );

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_SITE_LOGO",
      entityType: "SiteSettings",
      ipAddress,
      userAgent,
    });

    revalidateBranding();
    return actionOk({ logoUrl });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeSiteLogoAction(): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await siteSettingsService.removeSiteLogo(userId);

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REMOVE_SITE_LOGO",
      entityType: "SiteSettings",
      ipAddress,
      userAgent,
    });

    revalidateBranding();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function uploadSiteFaviconAction(
  formData: FormData
): Promise<ActionResult<{ faviconUrl: string }>> {
  try {
    const { userId } = await requireAdminSession();
    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const faviconUrl = await siteSettingsService.updateSiteFavicon(
      { buffer, originalName: file.name, mimeType: file.type },
      userId
    );

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_SITE_FAVICON",
      entityType: "SiteSettings",
      ipAddress,
      userAgent,
    });

    revalidateBranding();
    return actionOk({ faviconUrl });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeSiteFaviconAction(): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await siteSettingsService.removeSiteFavicon(userId);

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REMOVE_SITE_FAVICON",
      entityType: "SiteSettings",
      ipAddress,
      userAgent,
    });

    revalidateBranding();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
