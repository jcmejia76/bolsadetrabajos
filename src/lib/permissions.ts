import { Role } from "@/generated/prisma/enums";

export const PERMISSIONS = {
  [Role.ADMINISTRADOR]: ["*"],
  [Role.EMPRESA]: ["job:create", "job:edit-own", "application:view-own-jobs", "cv:download-applicant"],
  [Role.CANDIDATO]: ["application:create", "cv:manage-own", "profile:edit-own"],
} as const satisfies Record<Role, readonly string[]>;

export function can(role: Role, permission: string): boolean {
  const perms: readonly string[] = PERMISSIONS[role];
  return perms.includes("*") || perms.includes(permission);
}
