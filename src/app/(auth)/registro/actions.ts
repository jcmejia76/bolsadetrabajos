"use server";

import { actionOk, actionError, type ActionResult } from "@/lib/action-result";
import { registerSchema } from "@/validations/auth.schema";
import * as registrationService from "@/services/auth/registration.service";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}

export async function registerAction(input: unknown): Promise<ActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

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
