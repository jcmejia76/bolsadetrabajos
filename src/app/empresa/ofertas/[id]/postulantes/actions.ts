"use server";

import { revalidatePath } from "next/cache";
import { requireCompanySession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import {
  updateApplicationStatusSchema,
  applicationNoteSchema,
} from "@/validations/application.schema";
import * as applicationService from "@/services/application/application.service";

export async function updateApplicationStatusAction(
  jobPostingId: string,
  input: unknown
): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanySession();
    const parsed = updateApplicationStatusSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await applicationService.updateApplicationStatus(
      companyId,
      parsed.data.applicationId,
      parsed.data.status,
      userId,
      parsed.data.note
    );
    revalidatePath(`/empresa/ofertas/${jobPostingId}/postulantes`);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function addApplicationNoteAction(
  jobPostingId: string,
  input: unknown
): Promise<ActionResult<null>> {
  try {
    const { companyId, userId } = await requireCompanySession();
    const parsed = applicationNoteSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await applicationService.addApplicationNote(
      companyId,
      parsed.data.applicationId,
      userId,
      parsed.data.note
    );
    revalidatePath(`/empresa/ofertas/${jobPostingId}/postulantes`);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
