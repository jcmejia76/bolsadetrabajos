"use server";

import { revalidatePath } from "next/cache";
import { requireCompanyPermission } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { companyProfileSchema } from "@/validations/company.schema";
import * as companyService from "@/services/company/company.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";
import { Permission } from "@/generated/prisma/enums";

function revalidateEmpresaPerfil() {
  revalidatePath("/empresa/perfil");
  revalidatePath("/empresa");
}

export async function updateOwnCompanyAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const { userId, companyId } = await requireCompanyPermission(Permission.EMPRESA_PERFIL_EDITAR);
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
    revalidateEmpresaPerfil();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function uploadCompanyLogoAction(
  formData: FormData
): Promise<ActionResult<{ logoUrl: string }>> {
  try {
    const { companyId } = await requireCompanyPermission(Permission.EMPRESA_PERFIL_EDITAR);
    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const logoUrl = await companyService.updateCompanyLogo(companyId, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
    });
    revalidateEmpresaPerfil();
    return actionOk({ logoUrl });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeCompanyLogoAction(): Promise<ActionResult<null>> {
  try {
    const { companyId } = await requireCompanyPermission(Permission.EMPRESA_PERFIL_EDITAR);
    await companyService.removeCompanyLogo(companyId);
    revalidateEmpresaPerfil();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
