import { getMaintenanceState } from "@/services/settings/site-settings.service";
import { MaintenanceModeCard } from "./maintenance-mode-card";

export default async function AdminConfiguracionPage() {
  const { maintenanceMode, maintenanceMessage } = await getMaintenanceState();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ajustes generales de la plataforma.</p>
      </div>
      <MaintenanceModeCard
        initialEnabled={maintenanceMode}
        initialMessage={maintenanceMessage ?? ""}
      />
    </div>
  );
}
