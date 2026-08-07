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
import { deleteContentPageAction } from "./actions";

interface DeleteContentPageDialogProps {
  pageId: string;
  pageTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteContentPageDialog({
  pageId,
  pageTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteContentPageDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteContentPageAction(pageId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Página eliminada");
      onOpenChange(false);
      onDeleted?.();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar página</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar &quot;{pageTitle}&quot;? Esta acción no se puede deshacer y la URL
            pública dejará de estar disponible.
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
