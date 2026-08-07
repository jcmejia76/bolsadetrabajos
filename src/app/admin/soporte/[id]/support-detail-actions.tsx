"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SupportRequestStatus } from "@/generated/prisma/enums";
import { SUPPORT_STATUS_LABELS } from "@/lib/support-request-labels";
import { updateSupportRequestStatusAction } from "../actions";

export function SupportDetailActions({
  requestId,
  status,
  initialAdminNote,
}: {
  requestId: string;
  status: string;
  initialAdminNote: string;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [adminNote, setAdminNote] = useState(initialAdminNote);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateSupportRequestStatusAction(requestId, {
        status: nextStatus,
        adminNote,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Reporte actualizado");
      router.refresh();
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Gestionar reporte</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={nextStatus} onValueChange={(value) => value && setNextStatus(value)}>
            <SelectTrigger id="status" className="w-56">
              <SelectValue>{(value: string) => SUPPORT_STATUS_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(SupportRequestStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {SUPPORT_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="adminNote">Nota interna (opcional)</Label>
          <Textarea
            id="adminNote"
            rows={4}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Detalles de la resolución, seguimiento, etc."
            maxLength={2000}
          />
        </div>

        <Button className="w-fit" onClick={handleSave} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </CardContent>
    </Card>
  );
}
