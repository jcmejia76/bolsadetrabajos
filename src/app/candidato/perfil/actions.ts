"use server";

import { revalidatePath } from "next/cache";
import { requireCandidateSession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import { candidateProfileSchema } from "@/validations/candidate.schema";
import * as candidateService from "@/services/candidate/candidate.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

function revalidateCandidato() {
  revalidatePath("/candidato/perfil");
  revalidatePath("/candidato");
}

export async function updateCandidateProfileAction(input: unknown): Promise<ActionResult<null>> {
  try {
    const { candidateId } = await requireCandidateSession();
    const parsed = candidateProfileSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    await candidateService.updateCandidateProfile(candidateId, parsed.data);
    revalidateCandidato();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function uploadCandidatePhotoAction(
  formData: FormData
): Promise<ActionResult<{ photoUrl: string }>> {
  try {
    const { candidateId } = await requireCandidateSession();
    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const photoUrl = await candidateService.updateCandidatePhoto(candidateId, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
    });
    revalidateCandidato();
    return actionOk({ photoUrl });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function removeCandidatePhotoAction(): Promise<ActionResult<null>> {
  try {
    const { candidateId } = await requireCandidateSession();
    await candidateService.removeCandidatePhoto(candidateId);
    revalidateCandidato();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
