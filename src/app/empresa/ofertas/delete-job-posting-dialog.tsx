"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteJobPostingAction } from "./actions";

interface DeleteJobPostingDialogProps {
  jobPostingId: string;
  jobPostingTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteJobPostingDialog({
  jobPostingId,
  jobPostingTitle,
  open,
  onOpenChange,
}: DeleteJobPostingDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteJobPostingAction(jobPostingId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Oferta eliminada");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar oferta</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar &quot;{jobPostingTitle}&quot;? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
