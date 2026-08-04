import { LayoutDashboardIcon, BriefcaseIcon } from "lucide-react";

import { requireRole, enforceStaffActiveOrRedirect } from "@/lib/auth-utils";
import { Role } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen";
import { getMaintenanceState } from "@/services/settings/site-settings.service";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/empresa", label: "Panel", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
  { href: "/empresa/ofertas", label: "Ofertas", icon: <BriefcaseIcon className="size-4" /> },
];

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.EMPRESA);
  await enforceStaffActiveOrRedirect(session.user.id);

  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState();
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />;

  return (
    <SidebarShell
      navItems={NAV_ITEMS}
      panelLabel="Panel de Empresa"
      userLabel={session.user.email ?? undefined}
    >
      {children}
    </SidebarShell>
  );
}
