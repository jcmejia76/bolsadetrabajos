import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, StaffScope, StaffStatus, type Permission } from "@/generated/prisma/enums";

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

/**
 * For use inside Server Actions/Server Components (Node runtime only — never
 * in `proxy.ts`, which runs on Edge and cannot query the database). Permission
 * checks are always resolved live against the DB, never cached in the JWT, so
 * that revoking a staff member's access takes effect on their very next
 * request rather than waiting for their session to refresh.
 *
 * A user with role ADMINISTRADOR and no `StaffMember` row is the principal
 * admin and always has full access — their permissions can never be reduced.
 */
export async function requireSystemPermission(permission: Permission) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMINISTRADOR) {
    throw new Error("No autorizado");
  }

  const staffMember = await prisma.staffMember.findUnique({
    where: { userId: session.user.id },
    include: { role: { include: { permissions: true } } },
  });

  if (!staffMember) {
    return { userId: session.user.id, isPrincipal: true as const };
  }

  if (staffMember.status !== StaffStatus.ACTIVO) {
    throw new Error("No autorizado");
  }

  const granted = staffMember.role.permissions.some((p) => p.permission === permission);
  if (!granted) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return { userId: session.user.id, isPrincipal: false as const, staffMemberId: staffMember.id };
}

/**
 * Company-scoped equivalent of `requireSystemPermission`. A user with role
 * EMPRESA and no `StaffMember` row is the company owner (the account that
 * registered the company) and always has full access within their own
 * company; delegated staff are checked against their role's permissions.
 */
export async function requireCompanyPermission(permission: Permission) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.EMPRESA || !session.user.companyId) {
    throw new Error("No autorizado");
  }
  const companyId = session.user.companyId;

  const staffMember = await prisma.staffMember.findUnique({
    where: { userId: session.user.id },
    include: { role: { include: { permissions: true } } },
  });

  if (!staffMember) {
    return { userId: session.user.id, companyId, isOwner: true as const };
  }

  if (staffMember.scope !== StaffScope.EMPRESA || staffMember.companyId !== companyId) {
    throw new Error("No autorizado");
  }

  if (staffMember.status !== StaffStatus.ACTIVO) {
    throw new Error("No autorizado");
  }

  const granted = staffMember.role.permissions.some((p) => p.permission === permission);
  if (!granted) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return { userId: session.user.id, companyId, isOwner: false as const, staffMemberId: staffMember.id };
}

/**
 * For use at the top of `admin/layout.tsx`/`empresa/layout.tsx` (Server
 * Components, run on every navigation): if the current user is a staff
 * member whose access was revoked, force-signs them out immediately instead
 * of letting a stale session keep rendering the dashboard.
 */
export async function enforceStaffActiveOrRedirect(userId: string) {
  const staffMember = await prisma.staffMember.findUnique({
    where: { userId },
    select: { status: true },
  });
  if (
    staffMember &&
    (staffMember.status === StaffStatus.SUSPENDIDO || staffMember.status === StaffStatus.ELIMINADO)
  ) {
    await signOut({ redirectTo: "/login" });
  }
}
