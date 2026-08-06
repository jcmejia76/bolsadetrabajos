"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema, type ChangePasswordInput } from "@/validations/auth.schema";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function changePasswordAction(
  values: ChangePasswordInput
): Promise<ActionResult<{ success: true }>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");

    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) {
      return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true },
    });
    if (!user) return actionError("Usuario no encontrado");

    const isValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!isValid) return actionError("La contraseña actual es incorrecta");

    const newPasswordHash = await hashPassword(parsed.data.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: user.id,
      action: "CHANGE_PASSWORD",
      entityType: "User",
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return actionOk({ success: true });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
