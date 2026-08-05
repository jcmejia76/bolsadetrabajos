"use server";

import { revalidatePath } from "next/cache";
import { requireCompanySession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { companyProfileSchema } from "@/validations/company.schema";
import * as companyService from "@/services/company/company.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function updateOwnCompanyAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanySession();
    const parsed = companyProfileSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await companyService.updateCompany(companyId, parsed.data);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_OWN_COMPANY_PROFILE",
      entityType: "Company",
      entityId: companyId,
      ipAddress,
      userAgent,
    });
    revalidatePath("/empresa/perfil");
    revalidatePath("/empresa");
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
