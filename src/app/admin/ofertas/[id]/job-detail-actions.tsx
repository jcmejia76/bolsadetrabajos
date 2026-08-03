"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { JobStatus } from "@/generated/prisma/enums";
import {
  approveJobPostingAction,
  rejectJobPostingAction,
  requestJobPostingChangesAction,
  toggleJobPostingFeaturedAction,
} from "../actions";
import { ReasonDialog } from "../../_components/reason-dialog";

interface JobDetailActionsProps {
  jobPostingId: string;
  jobTitle: string;
  status: JobStatus;
  isFeatured: boolean;
}

export function JobDetailActions({ jobPostingId, jobTitle, status, isFeatured }: JobDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [changesOpen, setChangesOpen] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      const result = await approveJobPostingAction(jobPostingId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Oferta aprobada");
      router.refresh();
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      const result = await toggleJobPostingFeaturedAction(jobPostingId, !isFeatured);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(isFeatured ? "Ya no está destacada" : "Oferta destacada");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === JobStatus.PENDIENTE_APROBACION && (
        <>
          <Button onClick={handleApprove} disabled={isPending}>
            Aprobar
          </Button>
          <Button variant="outline" onClick={() => setChangesOpen(true)}>
            Solicitar cambios
          </Button>
          <Button variant="outline" onClick={() => setRejectOpen(true)}>
            Rechazar
          </Button>
        </>
      )}
      <Button variant="outline" onClick={handleToggleFeatured} disabled={isPending}>
        {isFeatured ? "Quitar destacado" : "Destacar"}
      </Button>

      <ReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Rechazar "${jobTitle}"`}
        confirmLabel="Rechazar"
        onConfirm={(reason) => rejectJobPostingAction(jobPostingId, reason)}
        onConfirmed={() => router.refresh()}
      />
      <ReasonDialog
        open={changesOpen}
        onOpenChange={setChangesOpen}
        title={`Solicitar cambios en "${jobTitle}"`}
        confirmLabel="Solicitar cambios"
        onConfirm={(reason) => requestJobPostingChangesAction(jobPostingId, reason)}
        onConfirmed={() => router.refresh()}
      />
    </div>
  );
}
