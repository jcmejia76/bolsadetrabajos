import { LayoutDashboardIcon, SendIcon, FileTextIcon, UserIcon, BookmarkIcon } from "lucide-react";

import { requireRole } from "@/lib/auth-utils";
import { Role } from "@/generated/prisma/enums";
import { SidebarShell, type DashboardNavItem } from "@/components/dashboard/sidebar-shell";
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen";
import { getMaintenanceState } from "@/services/settings/site-settings.service";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/candidato", label: "Resumen", icon: <LayoutDashboardIcon className="size-4" />, exact: true },
  { href: "/candidato/postulaciones", label: "Postulaciones", icon: <SendIcon className="size-4" /> },
  { href: "/candidato/cv", label: "Mis CVs", icon: <FileTextIcon className="size-4" /> },
  { href: "/candidato/perfil", label: "Mi Perfil", icon: <UserIcon className="size-4" /> },
  { href: "/candidato/favoritos", label: "Favoritos", icon: <BookmarkIcon className="size-4" /> },
];

export default async function CandidatoLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(Role.CANDIDATO);

  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState();
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />;

  return (
    <SidebarShell
      navItems={NAV_ITEMS}
      panelLabel="Panel de Candidato"
      userLabel={session.user.email ?? undefined}
    >
      {children}
    </SidebarShell>
  );
}
