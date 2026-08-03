import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/enums";

export async function getSessionOrRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await getSessionOrRedirect();
  if (!roles.includes(session.user.role)) redirect("/unauthorized");
  return session;
}

/**
 * For use inside Server Actions (never in pages/layouts): throws instead of
 * redirecting, since an action is a reachable POST endpoint regardless of UI gating.
 */
export async function requireCompanySession() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.EMPRESA || !session.user.companyId) {
    throw new Error("No autorizado");
  }
  return { userId: session.user.id, companyId: session.user.companyId };
}

export async function requireCandidateSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.CANDIDATO || !session.user.candidateId) {
    throw new Error("No autorizado");
  }
  return { userId: session.user.id, candidateId: session.user.candidateId };
}

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMINISTRADOR) {
    throw new Error("No autorizado");
  }
  return { userId: session.user.id };
}
