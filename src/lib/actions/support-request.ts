"use server";

import { auth } from "@/auth";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { supportRequestSchema } from "@/validations/support.schema";
import { createSupportRequest } from "@/services/support/support-request.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";

export async function submitSupportRequestAction(input: unknown): Promise<ActionResult<null>> {
  const parsed = supportRequestSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

  const { ipAddress } = await getRequestMeta();
  const withinIpLimit = checkRateLimit(`support:ip:${ipAddress ?? "unknown"}`, 5, 60 * 60 * 1000);
  if (!withinIpLimit) {
    return actionError("Demasiadas solicitudes. Intenta de nuevo más tarde.");
  }

  try {
    const session = await auth();
    await createSupportRequest(parsed.data, session?.user?.id ?? null);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
