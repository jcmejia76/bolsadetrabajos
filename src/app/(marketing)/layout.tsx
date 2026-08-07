import type { ReactNode } from "react"

import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { SkipLink } from "@/components/ui/skip-link"
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen"
import { getMaintenanceState, getSiteBranding } from "@/services/settings/site-settings.service"
import { listAllCategories } from "@/services/job-posting/job-posting-public.service"

const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMINISTRADOR]: "Administrador",
  [Role.EMPRESA]: "Empresa",
  [Role.CANDIDATO]: "Candidato",
}

const QUICK_LINKS_BY_ROLE: Record<Role, { label: string; href: string }[]> = {
  [Role.ADMINISTRADOR]: [
    { label: "Panel", href: "/admin" },
    { label: "Empresas", href: "/admin/empresas" },
    { label: "Ofertas", href: "/admin/ofertas" },
    { label: "CVs", href: "/admin/cvs" },
    { label: "Candidatos", href: "/admin/candidatos" },
    { label: "Postulaciones", href: "/admin/postulaciones" },
    { label: "Configuración", href: "/admin/configuracion" },
  ],
  [Role.EMPRESA]: [
    { label: "Panel", href: "/empresa" },
    { label: "Ofertas", href: "/empresa/ofertas" },
  ],
  [Role.CANDIDATO]: [
    { label: "Resumen", href: "/candidato" },
    { label: "Postulaciones", href: "/candidato/postulaciones" },
    { label: "Mis CVs", href: "/candidato/cv" },
    { label: "Mi Perfil", href: "/candidato/perfil" },
    { label: "Favoritos", href: "/candidato/favoritos" },
  ],
}

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  const [{ maintenanceMode, maintenanceMessage }, { logoUrl }] = await Promise.all([
    getMaintenanceState(),
    getSiteBranding(),
  ])
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} logoUrl={logoUrl} />

  const [session, categories] = await Promise.all([auth(), listAllCategories()])
  const user = session?.user
    ? {
        name: session.user.name ?? session.user.email,
        email: session.user.email,
        roleLabel: ROLE_LABEL[session.user.role],
        quickLinks: QUICK_LINKS_BY_ROLE[session.user.role],
      }
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar user={user} categories={categories} logoUrl={logoUrl} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer logoUrl={logoUrl} />
    </div>
  )
}
