"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { WrenchIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { setMaintenanceModeAction } from "./actions";

export function MaintenanceModeCard({
  initialEnabled,
  initialMessage,
}: {
  initialEnabled: boolean;
  initialMessage: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState(initialMessage);
  const [isPending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    setEnabled(next);
    startTransition(async () => {
      const result = await setMaintenanceModeAction({ enabled: next, message });
      if (!result.success) {
        toast.error(result.error);
        setEnabled(!next);
        return;
      }
      toast.success(next ? "Modo de mantenimiento activado" : "Modo de mantenimiento desactivado");
    });
  }

  function handleSaveMessage() {
    startTransition(async () => {
      const result = await setMaintenanceModeAction({ enabled, message });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Mensaje actualizado");
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <WrenchIcon className="size-4" />
          Modo de mantenimiento
        </CardTitle>
        <CardDescription>
          Al activarlo, los visitantes, empresas y candidatos verán una página de mantenimiento.
          Los administradores conservan acceso al panel para poder desactivarlo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="maintenance-switch">Sitio en mantenimiento</Label>
            <p className="text-sm text-muted-foreground">
              {enabled
                ? "El sitio está actualmente en mantenimiento."
                : "El sitio está funcionando con normalidad."}
            </p>
          </div>
          <Switch
            id="maintenance-switch"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="maintenance-message">Mensaje personalizado (opcional)</Label>
          <Textarea
            id="maintenance-message"
            placeholder="Estamos realizando mejoras en la plataforma. Volveremos pronto."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={handleSaveMessage}
            disabled={isPending}
          >
            Guardar mensaje
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
