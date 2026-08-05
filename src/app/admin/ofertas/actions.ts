"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { reasonSchema } from "@/validations/review-reason.schema";
import { jobPostingSchema } from "@/validations/job-posting.schema";
import * as jobReviewService from "@/services/admin/job-review.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

function revalidateJobs(jobPostingId?: string) {
  revalidatePath("/admin/ofertas");
  revalidatePath("/admin");
  if (jobPostingId) revalidatePath(`/admin/ofertas/${jobPostingId}`);
}

export async function approveJobPostingAction(jobPostingId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await jobReviewService.approveJobPosting(jobPostingId, userId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "APPROVE_JOB_POSTING",
      entityType: "JobPosting",
      entityId: jobPostingId,
      ipAddress,
      userAgent,
    });
    revalidateJobs(jobPostingId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function rejectJobPostingAction(
  jobPostingId: string,
  reason: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await jobReviewService.rejectJobPosting(jobPostingId, userId, parsed.data.reason);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REJECT_JOB_POSTING",
      entityType: "JobPosting",
      entityId: jobPostingId,
      after: { reason: parsed.data.reason },
      ipAddress,
      userAgent,
    });
    revalidateJobs(jobPostingId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function requestJobPostingChangesAction(
  jobPostingId: string,
  reason: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await jobReviewService.requestJobPostingChanges(jobPostingId, userId, parsed.data.reason);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REQUEST_JOB_POSTING_CHANGES",
      entityType: "JobPosting",
      entityId: jobPostingId,
      after: { reason: parsed.data.reason },
      ipAddress,
      userAgent,
    });
    revalidateJobs(jobPostingId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function toggleJobPostingFeaturedAction(
  jobPostingId: string,
  isFeatured: boolean
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await jobReviewService.toggleJobPostingFeatured(jobPostingId, isFeatured);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "TOGGLE_JOB_POSTING_FEATURED",
      entityType: "JobPosting",
      entityId: jobPostingId,
      after: { isFeatured },
      ipAddress,
      userAgent,
    });
    revalidateJobs(jobPostingId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function updateJobPostingAsAdminAction(
  jobPostingId: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = jobPostingSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const job = await jobReviewService.updateJobPostingAsAdmin(jobPostingId, parsed.data);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_JOB_POSTING",
      entityType: "JobPosting",
      entityId: job.id,
      ipAddress,
      userAgent,
    });
    revalidateJobs(jobPostingId);
    return actionOk({ id: job.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
