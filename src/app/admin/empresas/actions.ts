"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { reasonSchema } from "@/validations/review-reason.schema";
import { companyProfileSchema } from "@/validations/company.schema";
import * as companyService from "@/services/company/company.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

function revalidateCompanies(companyId?: string) {
  revalidatePath("/admin/empresas");
  revalidatePath("/admin");
  if (companyId) revalidatePath(`/admin/empresas/${companyId}`);
}

export async function approveCompanyAction(companyId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await companyService.approveCompany(companyId, userId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "APPROVE_COMPANY",
      entityType: "Company",
      entityId: companyId,
      ipAddress,
      userAgent,
    });
    revalidateCompanies(companyId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function rejectCompanyAction(
  companyId: string,
  reason: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await companyService.rejectCompany(companyId, userId, parsed.data.reason);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REJECT_COMPANY",
      entityType: "Company",
      entityId: companyId,
      after: { reason: parsed.data.reason },
      ipAddress,
      userAgent,
    });
    revalidateCompanies(companyId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function suspendCompanyAction(
  companyId: string,
  reason: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await companyService.suspendCompany(companyId, userId, parsed.data.reason);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "SUSPEND_COMPANY",
      entityType: "Company",
      entityId: companyId,
      after: { reason: parsed.data.reason },
      ipAddress,
      userAgent,
    });
    revalidateCompanies(companyId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function reactivateCompanyAction(companyId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await companyService.reactivateCompany(companyId, userId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "REACTIVATE_COMPANY",
      entityType: "Company",
      entityId: companyId,
      ipAddress,
      userAgent,
    });
    revalidateCompanies(companyId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function updateCompanyAction(
  companyId: string,
  input: unknown
): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = companyProfileSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await companyService.updateCompany(companyId, parsed.data);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_COMPANY",
      entityType: "Company",
      entityId: companyId,
      ipAddress,
      userAgent,
    });
    revalidateCompanies(companyId);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteCompanyAction(companyId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    await companyService.deleteCompany(companyId);
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "DELETE_COMPANY",
      entityType: "Company",
      entityId: companyId,
      ipAddress,
      userAgent,
    });
    revalidateCompanies();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
