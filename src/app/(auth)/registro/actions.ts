"use server";

import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { registerSchema } from "@/validations/auth.schema";
import * as registrationService from "@/services/auth/registration.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";

export async function registerAction(input: unknown): Promise<ActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

  const { ipAddress } = await getRequestMeta();
  const withinIpLimit = checkRateLimit(`register:ip:${ipAddress ?? "unknown"}`, 10, 60 * 60 * 1000);
  const withinEmailLimit = checkRateLimit(`register:email:${parsed.data.email}`, 3, 60 * 60 * 1000);
  if (!withinIpLimit || !withinEmailLimit) {
    return actionError("Demasiados intentos. Intenta de nuevo más tarde.");
  }

  try {
    if (parsed.data.type === "candidato") {
      const { firstName, lastName, email, password } = parsed.data;
      await registrationService.registerCandidate({ firstName, lastName, email, password });
    } else {
      const { companyName, email, password } = parsed.data;
      await registrationService.registerCompany({ name: companyName, email, password });
    }
    return actionOk({ email: parsed.data.email });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
