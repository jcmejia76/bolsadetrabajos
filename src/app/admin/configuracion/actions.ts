"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import { maintenanceModeSchema } from "@/validations/site-settings.schema";
import * as siteSettingsService from "@/services/settings/site-settings.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

export async function setMaintenanceModeAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = maintenanceModeSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await siteSettingsService.setMaintenanceMode(parsed.data.enabled, parsed.data.message?.trim() || null, userId);
    revalidatePath("/admin/configuracion");
    revalidatePath("/", "layout");
    revalidatePath("/empresa", "layout");
    revalidatePath("/candidato", "layout");
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
