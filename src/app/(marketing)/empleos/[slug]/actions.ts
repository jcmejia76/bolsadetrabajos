"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/enums";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { createApplication } from "@/services/application/application.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function applyToJobAction(
  jobPostingId: string,
  jobSlug: string
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.user) {
    return actionError("Inicia sesión como candidato para postularte a esta vacante.");
  }
  if (session.user.role !== Role.CANDIDATO || !session.user.candidateId) {
    return actionError("Solo las cuentas de candidato pueden postularse a vacantes.");
  }

  try {
    await createApplication(session.user.candidateId, jobPostingId, session.user.id);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: session.user.id,
      action: "APPLY_TO_JOB",
      entityType: "JobPosting",
      entityId: jobPostingId,
      ipAddress,
      userAgent,
    });
    revalidatePath(`/empleos/${jobSlug}`);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
