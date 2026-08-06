import { LayoutDashboardIcon, BriefcaseIcon, BuildingIcon, UsersIcon, KeyRoundIcon } from "lucide-react";

import { requireRole, enforceStaffActiveOrRedirect } from "@/lib/auth-utils";
import { Role, Permission } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen";
import { getMaintenanceState } from "@/services/settings/site-settings.service";
import { getCompanyStaffPermissions } from "@/services/staff/staff.service";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import { listRecentNotifications, countUnreadNotifications } from "@/services/notification/notification.service";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.EMPRESA);
  await enforceStaffActiveOrRedirect(session.user.id);

  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState();
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />;

  const [{ isOwner, permissions }, notifications, unreadCount] = await Promise.all([
    getCompanyStaffPermissions(session.user.id, session.user.companyId!),
    listRecentNotifications(session.user.id),
    countUnreadNotifications(session.user.id),
  ]);

  const navItems: DashboardNavItem[] = [
    { href: "/empresa", label: "Panel", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
    { href: "/empresa/ofertas", label: "Ofertas", icon: <BriefcaseIcon className="size-4" /> },
    ...(isOwner || permissions.includes(Permission.EMPRESA_PERFIL_EDITAR)
      ? [{ href: "/empresa/perfil", label: "Mi Empresa", icon: <BuildingIcon className="size-4" /> }]
      : []),
    ...(isOwner || permissions.includes(Permission.EMPRESA_EQUIPO_INVITAR)
      ? [{ href: "/empresa/equipo", label: "Equipo", icon: <UsersIcon className="size-4" /> }]
      : []),
    { href: "/empresa/cuenta", label: "Mi Cuenta", icon: <KeyRoundIcon className="size-4" /> },
  ];

  return (
    <SidebarShell
      navItems={navItems}
      panelLabel="Panel de Empresa"
      userLabel={session.user.email ?? undefined}
      notificationsSlot={<NotificationsBell notifications={notifications} unreadCount={unreadCount} />}
    >
      {children}
    </SidebarShell>
  );
}
