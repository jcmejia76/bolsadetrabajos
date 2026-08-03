"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { uploadCvAction } from "./actions";

interface UploadCvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadCvDialog({ open, onOpenChange }: UploadCvDialogProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadCvAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("CV subido correctamente");
      setFile(null);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir CV</DialogTitle>
          <DialogDescription>Formatos permitidos: PDF, DOC, DOCX.</DialogDescription>
        </DialogHeader>
        <Input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !file}>
            {isPending ? "Subiendo..." : "Subir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
