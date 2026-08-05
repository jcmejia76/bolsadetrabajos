import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role, StaffScope, StaffStatus, Permission } from "@/generated/prisma/client";

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Permissions granted to a company's default staff role — day-to-day recruiting work, not company settings or team management. */
const DEFAULT_COMPANY_ROLE_PERMISSIONS: Permission[] = [
  Permission.EMPRESA_OFERTAS_VER,
  Permission.EMPRESA_OFERTAS_CREAR,
  Permission.EMPRESA_OFERTAS_EDITAR,
  Permission.EMPRESA_OFERTAS_PUBLICAR,
  Permission.EMPRESA_OFERTAS_PAUSAR,
  Permission.EMPRESA_POSTULACIONES_VER,
  Permission.EMPRESA_POSTULACIONES_REVISAR,
  Permission.EMPRESA_POSTULACIONES_CAMBIAR_ESTADO,
  Permission.EMPRESA_POSTULACIONES_DESCARGAR_CV,
  Permission.EMPRESA_POSTULACIONES_AGREGAR_NOTAS,
  Permission.EMPRESA_ESTADISTICAS_VER,
];

async function getOrCreateDefaultCompanyRole(companyId: string) {
  const existing = await prisma.staffRole.findFirst({
    where: { scope: StaffScope.EMPRESA, companyId, isSystemDefault: true },
  });
  if (existing) return existing;

  return prisma.staffRole.create({
    data: {
      scope: StaffScope.EMPRESA,
      companyId,
      name: "Miembro del equipo",
      description: "Puede gestionar ofertas y postulaciones, sin acceso al perfil ni al equipo.",
      isSystemDefault: true,
      permissions: { create: DEFAULT_COMPANY_ROLE_PERMISSIONS.map((permission) => ({ permission })) },
    },
  });
}

export async function listCompanyStaff(companyId: string) {
  return prisma.staffMember.findMany({
    where: { companyId, scope: StaffScope.EMPRESA },
    include: { user: { select: { email: true } }, role: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function inviteCompanyStaffMember(
  companyId: string,
  invitedById: string,
  email: string,
  jobTitle?: string
) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new Error("Ya existe una cuenta con este correo");
  }

  const role = await getOrCreateDefaultCompanyRole(companyId);
  const invitationToken = randomBytes(32).toString("hex");
  // Random, never communicated — the only way into the account is the invitation link, which sets a real password on accept.
  const placeholderPasswordHash = await hashPassword(randomBytes(24).toString("hex"));

  await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash: placeholderPasswordHash,
      role: Role.EMPRESA,
      staffAccount: {
        create: {
          scope: StaffScope.EMPRESA,
          companyId,
          roleId: role.id,
          status: StaffStatus.INVITADO,
          jobTitle: jobTitle?.trim() || null,
          invitedById,
          invitationToken,
          invitationExpiresAt: new Date(Date.now() + INVITATION_TTL_MS),
        },
      },
    },
  });

  return { invitationToken };
}

export async function getInvitationByToken(token: string) {
  const staffMember = await prisma.staffMember.findUnique({
    where: { invitationToken: token },
    include: {
      user: { select: { email: true } },
      company: { select: { name: true } },
      role: { select: { name: true } },
    },
  });
  if (!staffMember || staffMember.status !== StaffStatus.INVITADO) return null;
  if (staffMember.invitationExpiresAt && staffMember.invitationExpiresAt < new Date()) return null;
  return staffMember;
}

export async function acceptStaffInvitation(token: string, password: string) {
  const staffMember = await getInvitationByToken(token);
  if (!staffMember) throw new Error("La invitación no es válida o ya expiró");

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: staffMember.userId }, data: { passwordHash } }),
    prisma.staffMember.update({
      where: { id: staffMember.id },
      data: {
        status: StaffStatus.ACTIVO,
        acceptedAt: new Date(),
        invitationToken: null,
      },
    }),
  ]);

  return { email: staffMember.user.email };
}

async function findOwnedStaffMember(companyId: string, staffMemberId: string) {
  const staffMember = await prisma.staffMember.findFirst({
    where: { id: staffMemberId, companyId, scope: StaffScope.EMPRESA },
  });
  if (!staffMember) throw new Error("Miembro del equipo no encontrado");
  return staffMember;
}

export async function suspendCompanyStaffMember(companyId: string, staffMemberId: string) {
  await findOwnedStaffMember(companyId, staffMemberId);
  await prisma.staffMember.update({
    where: { id: staffMemberId },
    data: { status: StaffStatus.SUSPENDIDO, suspendedAt: new Date() },
  });
}

export async function reactivateCompanyStaffMember(companyId: string, staffMemberId: string) {
  await findOwnedStaffMember(companyId, staffMemberId);
  await prisma.staffMember.update({
    where: { id: staffMemberId },
    data: { status: StaffStatus.ACTIVO, suspendedAt: null },
  });
}

export async function removeCompanyStaffMember(companyId: string, staffMemberId: string) {
  const staffMember = await findOwnedStaffMember(companyId, staffMemberId);
  await prisma.$transaction([
    prisma.staffMember.update({ where: { id: staffMemberId }, data: { status: StaffStatus.ELIMINADO } }),
    prisma.user.update({ where: { id: staffMember.userId }, data: { isActive: false } }),
  ]);
}

/** For UI gating only (e.g. hiding nav items) — the real enforcement lives in requireCompanyPermission. */
export async function getCompanyStaffPermissions(userId: string, companyId: string) {
  const staffMember = await prisma.staffMember.findUnique({
    where: { userId },
    include: { role: { include: { permissions: true } } },
  });
  if (!staffMember || staffMember.companyId !== companyId) return { isOwner: true, permissions: [] as Permission[] };
  return {
    isOwner: false,
    permissions: staffMember.role.permissions.map((p) => p.permission),
  };
}

export type CompanyStaffMember = Awaited<ReturnType<typeof listCompanyStaff>>[number];
export type StaffInvitation = NonNullable<Awaited<ReturnType<typeof getInvitationByToken>>>;
