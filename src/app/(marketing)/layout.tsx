import type { ReactNode } from "react"

import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { MaintenanceScreen } from "@/components/maintenance/maintenance-screen"
import { getMaintenanceState } from "@/services/settings/site-settings.service"

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState()
  if (maintenanceMode) return <MaintenanceScreen message={maintenanceMessage} />

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
