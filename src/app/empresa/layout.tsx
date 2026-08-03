import { LayoutDashboardIcon, BriefcaseIcon } from "lucide-react";

import { requireRole } from "@/lib/auth-utils";
import { Role } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/empresa", label: "Panel", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
  { href: "/empresa/ofertas", label: "Ofertas", icon: <BriefcaseIcon className="size-4" /> },
];

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.EMPRESA);

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
