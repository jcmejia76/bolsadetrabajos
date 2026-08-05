import { LayoutDashboardIcon, BriefcaseIcon, BuildingIcon, UsersIcon } from "lucide-react";

import { requireRole, enforceStaffActiveOrRedirect } from "@/lib/auth-utils";
import { Role, Permission } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen";
import { getMaintenanceState } from "@/services/settings/site-settings.service";
import { getCompanyStaffPermissions } from "@/services/staff/staff.service";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.EMPRESA);
  await enforceStaffActiveOrRedirect(session.user.id);

  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState();
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />;

  const { isOwner, permissions } = await getCompanyStaffPermissions(
    session.user.id,
    session.user.companyId!
  );

  const navItems: DashboardNavItem[] = [
    { href: "/empresa", label: "Panel", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
    { href: "/empresa/ofertas", label: "Ofertas", icon: <BriefcaseIcon className="size-4" /> },
    ...(isOwner || permissions.includes(Permission.EMPRESA_PERFIL_EDITAR)
      ? [{ href: "/empresa/perfil", label: "Mi Empresa", icon: <BuildingIcon className="size-4" /> }]
      : []),
    ...(isOwner || permissions.includes(Permission.EMPRESA_EQUIPO_INVITAR)
      ? [{ href: "/empresa/equipo", label: "Equipo", icon: <UsersIcon className="size-4" /> }]
      : []),
  ];

  return (
    <SidebarShell
      navItems={navItems}
      panelLabel="Panel de Empresa"
      userLabel={session.user.email ?? undefined}
    >
      {children}
    </SidebarShell>
  );
}
