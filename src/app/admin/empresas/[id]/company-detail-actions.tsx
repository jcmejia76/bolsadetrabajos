"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CompanyStatus } from "@/generated/prisma/enums";
import { approveCompanyAction, rejectCompanyAction, suspendCompanyAction } from "../actions";
import { ReasonDialog } from "../../_components/reason-dialog";
import { DeleteCompanyDialog } from "../delete-company-dialog";

interface CompanyDetailActionsProps {
  companyId: string;
  companyName: string;
  status: CompanyStatus;
}

export function CompanyDetailActions({ companyId, companyName, status }: CompanyDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      const result = await approveCompanyAction(companyId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Empresa aprobada");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === CompanyStatus.PENDIENTE && (
        <>
          <Button onClick={handleApprove} disabled={isPending}>
            Aprobar
          </Button>
          <Button variant="outline" onClick={() => setRejectOpen(true)}>
            Rechazar
          </Button>
        </>
      )}
      {status === CompanyStatus.APROBADA && (
        <Button variant="outline" onClick={() => setSuspendOpen(true)}>
          Suspender
        </Button>
      )}
      {(status === CompanyStatus.SUSPENDIDA || status === CompanyStatus.RECHAZADA) && (
        <Button onClick={handleApprove} disabled={isPending}>
          Reactivar
        </Button>
      )}
      <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
        Eliminar
      </Button>

      <ReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Rechazar "${companyName}"`}
        confirmLabel="Rechazar"
        onConfirm={(reason) => rejectCompanyAction(companyId, reason)}
        onConfirmed={() => router.refresh()}
      />
      <ReasonDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title={`Suspender "${companyName}"`}
        confirmLabel="Suspender"
        onConfirm={(reason) => suspendCompanyAction(companyId, reason)}
        onConfirmed={() => router.refresh()}
      />
      <DeleteCompanyDialog
        companyId={companyId}
        companyName={companyName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push("/admin/empresas")}
      />
    </div>
  );
}
