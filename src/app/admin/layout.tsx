import {
  LayoutDashboardIcon,
  Building2Icon,
  BriefcaseIcon,
  FileTextIcon,
  UsersIcon,
  SendIcon,
} from "lucide-react";

import { requireRole } from "@/lib/auth-utils";
import { Role } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/admin", label: "Panel", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
  { href: "/admin/empresas", label: "Empresas", icon: <Building2Icon className="size-4" /> },
  { href: "/admin/ofertas", label: "Ofertas", icon: <BriefcaseIcon className="size-4" /> },
  { href: "/admin/cvs", label: "CVs", icon: <FileTextIcon className="size-4" /> },
  { href: "/admin/candidatos", label: "Candidatos", icon: <UsersIcon className="size-4" /> },
  { href: "/admin/postulaciones", label: "Postulaciones", icon: <SendIcon className="size-4" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.ADMINISTRADOR);

  return (
    <SidebarShell
      navItems={NAV_ITEMS}
      panelLabel="Panel de Administrador"
      userLabel={session.user.email ?? undefined}
    >
      {children}
    </SidebarShell>
  );
}
