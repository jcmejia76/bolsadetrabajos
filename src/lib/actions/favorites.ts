"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/enums";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { toggleFavorite } from "@/services/favorite/favorite.service";

export async function toggleFavoriteAction(
  jobPostingId: string
): Promise<ActionResult<{ favorited: boolean }>> {
  const session = await auth();
  if (!session?.user) {
    return actionError("Inicia sesión como candidato para guardar empleos.");
  }
  if (session.user.role !== Role.CANDIDATO || !session.user.candidateId) {
    return actionError("Solo las cuentas de candidato pueden guardar empleos.");
  }

  try {
    const favorited = await toggleFavorite(session.user.candidateId, jobPostingId);
    revalidatePath("/candidato/favoritos");
    return actionOk({ favorited });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
