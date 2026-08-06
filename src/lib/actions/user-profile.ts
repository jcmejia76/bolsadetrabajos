"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { personalProfileSchema } from "@/validations/user.schema";
import * as userService from "@/services/user/user.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

function revalidateCuenta() {
  revalidatePath("/empresa/cuenta");
  revalidatePath("/admin/cuenta");
}

export async function updateUserProfileAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");

    const parsed = personalProfileSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await userService.updateUserPersonalProfile(session.user.id, parsed.data);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: session.user.id,
      action: "UPDATE_PERSONAL_PROFILE",
      entityType: "User",
      entityId: session.user.id,
      ipAddress,
      userAgent,
    });
    revalidateCuenta();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function uploadUserPhotoAction(
  formData: FormData
): Promise<ActionResult<{ photoUrl: string }>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");

    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const photoUrl = await userService.updateUserPhoto(session.user.id, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
    });
    revalidateCuenta();
    return actionOk({ photoUrl });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeUserPhotoAction(): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");

    await userService.removeUserPhoto(session.user.id);
    revalidateCuenta();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
