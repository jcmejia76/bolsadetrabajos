"use server";

import { revalidatePath } from "next/cache";
import { requireCompanyPermission } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { staffInviteSchema } from "@/validations/staff.schema";
import * as staffService from "@/services/staff/staff.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";
import { Permission } from "@/generated/prisma/enums";

function revalidateEquipo() {
  revalidatePath("/empresa/equipo");
}

export async function inviteStaffMemberAction(input: unknown): Promise<ActionResult<{ invitationUrl: string }>> {
  try {
    const { userId, companyId } = await requireCompanyPermission(Permission.EMPRESA_EQUIPO_INVITAR);
    const parsed = staffInviteSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const { invitationToken } = await staffService.inviteCompanyStaffMember(
      companyId,
      userId,
      parsed.data.email,
      parsed.data.jobTitle
    );
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "INVITE_STAFF_MEMBER",
      entityType: "StaffMember",
      after: { email: parsed.data.email, companyId },
      ipAddress,
      userAgent,
    });
    revalidateEquipo();
    return actionOk({ invitationUrl: `/invitaciones/${invitationToken}` });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function suspendStaffMemberAction(staffMemberId: string): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanyPermission(Permission.EMPRESA_EQUIPO_EDITAR_PERMISOS);
    await staffService.suspendCompanyStaffMember(companyId, staffMemberId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "SUSPEND_STAFF_MEMBER",
      entityType: "StaffMember",
      entityId: staffMemberId,
      ipAddress,
      userAgent,
    });
    revalidateEquipo();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function reactivateStaffMemberAction(staffMemberId: string): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanyPermission(Permission.EMPRESA_EQUIPO_EDITAR_PERMISOS);
    await staffService.reactivateCompanyStaffMember(companyId, staffMemberId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REACTIVATE_STAFF_MEMBER",
      entityType: "StaffMember",
      entityId: staffMemberId,
      ipAddress,
      userAgent,
    });
    revalidateEquipo();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeStaffMemberAction(staffMemberId: string): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanyPermission(Permission.EMPRESA_EQUIPO_ELIMINAR);
    await staffService.removeCompanyStaffMember(companyId, staffMemberId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REMOVE_STAFF_MEMBER",
      entityType: "StaffMember",
      entityId: staffMemberId,
      ipAddress,
      userAgent,
    });
    revalidateEquipo();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
