"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import * as candidateAdminService from "@/services/admin/candidate-admin.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

function revalidateCandidates() {
  revalidatePath("/admin/candidatos");
  revalidatePath("/admin");
}

export async function suspendCandidateAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await candidateAdminService.suspendCandidate(candidateId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "SUSPEND_CANDIDATE",
      entityType: "Candidate",
      entityId: candidateId,
      ipAddress,
      userAgent,
    });
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function reactivateCandidateAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await candidateAdminService.reactivateCandidate(candidateId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REACTIVATE_CANDIDATE",
      entityType: "Candidate",
      entityId: candidateId,
      ipAddress,
      userAgent,
    });
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteCandidateProfileAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await candidateAdminService.deleteCandidateProfile(candidateId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "DELETE_CANDIDATE_PROFILE",
      entityType: "Candidate",
      entityId: candidateId,
      ipAddress,
      userAgent,
    });
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
