"use server";

import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { acceptInvitationSchema } from "@/validations/staff.schema";
import { acceptStaffInvitation } from "@/services/staff/staff.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function acceptInvitationAction(
  input: unknown
): Promise<ActionResult<{ email: string }>> {
  const parsed = acceptInvitationSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

  try {
    const { email } = await acceptStaffInvitation(parsed.data.token, parsed.data.password);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: null,
      action: "ACCEPT_STAFF_INVITATION",
      entityType: "StaffMember",
      after: { email },
      ipAddress,
      userAgent,
    });
    return actionOk({ email });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
