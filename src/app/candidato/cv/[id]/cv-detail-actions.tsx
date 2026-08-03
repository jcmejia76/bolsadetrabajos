"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setPrimaryCvAction } from "../actions";
import { DeleteCvDialog } from "../delete-cv-dialog";

interface CvDetailActionsProps {
  cvId: string;
  cvFileName: string;
  isPrimary: boolean;
}

export function CvDetailActions({ cvId, cvFileName, isPrimary }: CvDetailActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleSetPrimary() {
    startTransition(async () => {
      const result = await setPrimaryCvAction(cvId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("CV marcado como principal");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      {!isPrimary && (
        <Button variant="outline" onClick={handleSetPrimary} disabled={isPending}>
          Marcar como principal
        </Button>
      )}
      <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
        Eliminar
      </Button>
      <DeleteCvDialog
        cvId={cvId}
        cvFileName={cvFileName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push("/candidato/cv")}
      />
    </div>
  );
}
