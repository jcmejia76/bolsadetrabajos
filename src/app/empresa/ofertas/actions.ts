"use server";

import { revalidatePath } from "next/cache";
import { requireCompanySession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import { jobPostingSchema } from "@/validations/job-posting.schema";
import * as jobPostingService from "@/services/job-posting/job-posting.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

function revalidateOfertas() {
  revalidatePath("/empresa/ofertas");
  revalidatePath("/empresa");
}

export async function createJobPostingAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { companyId, userId } = await requireCompanySession();
    const parsed = jobPostingSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const jobPosting = await jobPostingService.createJobPosting(companyId, userId, parsed.data);
    revalidateOfertas();
    return actionOk({ id: jobPosting.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function updateJobPostingAction(
  jobPostingId: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const { companyId } = await requireCompanySession();
    const parsed = jobPostingSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const jobPosting = await jobPostingService.updateJobPosting(companyId, jobPostingId, parsed.data);
    revalidateOfertas();
    revalidatePath(`/empresa/ofertas/${jobPostingId}/editar`);
    return actionOk({ id: jobPosting.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function submitForReviewAction(jobPostingId: string): Promise<ActionResult<null>> {
  try {
    const { companyId } = await requireCompanySession();
    await jobPostingService.submitJobPostingForReview(companyId, jobPostingId);
    revalidateOfertas();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function pauseJobPostingAction(jobPostingId: string): Promise<ActionResult<null>> {
  try {
    const { companyId } = await requireCompanySession();
    await jobPostingService.pauseJobPosting(companyId, jobPostingId);
    revalidateOfertas();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function resumeJobPostingAction(jobPostingId: string): Promise<ActionResult<null>> {
  try {
    const { companyId } = await requireCompanySession();
    await jobPostingService.resumeJobPosting(companyId, jobPostingId);
    revalidateOfertas();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteJobPostingAction(jobPostingId: string): Promise<ActionResult<null>> {
  try {
    const { companyId } = await requireCompanySession();
    await jobPostingService.deleteJobPosting(companyId, jobPostingId);
    revalidateOfertas();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function duplicateJobPostingAction(
  jobPostingId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const { companyId, userId } = await requireCompanySession();
    const jobPosting = await jobPostingService.duplicateJobPosting(companyId, jobPostingId, userId);
    revalidateOfertas();
    return actionOk({ id: jobPosting.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
