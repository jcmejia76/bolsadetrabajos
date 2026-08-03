"use server";

import { revalidatePath } from "next/cache";
import { requireCandidateSession } from "@/lib/auth-utils";
import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import * as cvService from "@/services/cv/cv.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

function revalidateCvs() {
  revalidatePath("/candidato/cv");
  revalidatePath("/candidato");
}

export async function uploadCvAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const { candidateId } = await requireCandidateSession();
    const file = formData.get("file");
    if (!(file instanceof File)) return actionError("Archivo no válido");

    const buffer = Buffer.from(await file.arrayBuffer());
    const cv = await cvService.uploadCv(candidateId, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
    });
    revalidateCvs();
    return actionOk({ id: cv.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function generateCvAction(): Promise<ActionResult<{ id: string }>> {
  try {
    const { candidateId } = await requireCandidateSession();
    const cv = await cvService.generateCvFromProfile(candidateId);
    revalidateCvs();
    return actionOk({ id: cv.id });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function setPrimaryCvAction(cvId: string): Promise<ActionResult<null>> {
  try {
    const { candidateId } = await requireCandidateSession();
    await cvService.setPrimaryCv(candidateId, cvId);
    revalidateCvs();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteCvAction(cvId: string): Promise<ActionResult<null>> {
  try {
    const { candidateId } = await requireCandidateSession();
    await cvService.deleteCv(candidateId, cvId);
    revalidateCvs();
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
