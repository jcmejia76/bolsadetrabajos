import { getMaintenanceState, getSiteBranding } from "@/services/settings/site-settings.service";
import { MaintenanceModeCard } from "./maintenance-mode-card";
import { LogoFaviconCard } from "./logo-favicon-card";

export default async function AdminConfiguracionPage() {
  const [{ maintenanceMode, maintenanceMessage }, { logoUrl, faviconUrl }] = await Promise.all([
    getMaintenanceState(),
    getSiteBranding(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ajustes generales de la plataforma.</p>
      </div>
      <LogoFaviconCard initialLogoUrl={logoUrl} initialFaviconUrl={faviconUrl} />
      <MaintenanceModeCard
        initialEnabled={maintenanceMode}
        initialMessage={maintenanceMessage ?? ""}
      />
    </div>
  );
}
