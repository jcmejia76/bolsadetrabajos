"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import { reasonSchema } from "@/validations/review-reason.schema";
import * as cvReviewService from "@/services/admin/cv-review.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

function revalidateCvs() {
  revalidatePath("/admin/cvs");
  revalidatePath("/admin/candidatos");
  revalidatePath("/admin");
}

export async function approveCvAction(cvId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await cvReviewService.approveCv(cvId, userId);
    revalidateCvs();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function rejectCvAction(cvId: string, reason: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await cvReviewService.rejectCv(cvId, userId, parsed.data.reason);
    revalidateCvs();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function requestCvChangesAction(
  cvId: string,
  reason: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await cvReviewService.requestCvChanges(cvId, userId, parsed.data.reason);
    revalidateCvs();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

