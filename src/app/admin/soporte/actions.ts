"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { updateSupportRequestStatusSchema } from "@/validations/support.schema";
import * as supportService from "@/services/support/support-request.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function updateSupportRequestStatusAction(
  id: string,
  input: unknown
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = updateSupportRequestStatusSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await supportService.updateSupportRequestStatus(
      id,
      { status: parsed.data.status, adminNote: parsed.data.adminNote || null },
      userId
    );

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_SUPPORT_REQUEST_STATUS",
      entityType: "SupportRequest",
      entityId: id,
      after: { status: parsed.data.status },
      ipAddress,
      userAgent,
    });

    revalidatePath("/admin/soporte");
    revalidatePath(`/admin/soporte/${id}`);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
