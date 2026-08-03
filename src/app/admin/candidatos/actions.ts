"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import * as candidateAdminService from "@/services/admin/candidate-admin.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

function revalidateCandidates() {
  revalidatePath("/admin/candidatos");
  revalidatePath("/admin");
}

export async function suspendCandidateAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    await requireAdminSession();
    await candidateAdminService.suspendCandidate(candidateId);
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function reactivateCandidateAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    await requireAdminSession();
    await candidateAdminService.reactivateCandidate(candidateId);
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteCandidateProfileAction(candidateId: string): Promise<ActionResult<null>> {
  try {
    await requireAdminSession();
    await candidateAdminService.deleteCandidateProfile(candidateId);
    revalidateCandidates();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
