import { BriefcaseBusinessIcon, WrenchIcon } from "lucide-react";

const DEFAULT_MESSAGE =
  "Estamos realizando mejoras en la plataforma. Volveremos a estar disponibles muy pronto.";

export function MaintenanceScreen({ message }: { message?: string | null }) {
  return (
    <main id="main-content" className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-grid-fade p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />
      <div className="relative z-10 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BriefcaseBusinessIcon className="size-4.5" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Bolsa de Trabajos
        </span>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <WrenchIcon className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Estamos en mantenimiento
        </h1>
        <p className="max-w-md text-muted-foreground">
          {message?.trim() ? message : DEFAULT_MESSAGE}
        </p>
      </div>
    </main>
  );
}
