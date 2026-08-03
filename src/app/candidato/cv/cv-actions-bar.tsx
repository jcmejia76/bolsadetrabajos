"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UploadCvDialog } from "./upload-cv-dialog";
import { generateCvAction } from "./actions";

export function CvActionsBar() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateCvAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("CV generado a partir de tu perfil");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleGenerate} disabled={isPending}>
        {isPending ? "Generando..." : "Generar CV desde mi perfil"}
      </Button>
      <Button onClick={() => setUploadOpen(true)}>Subir CV</Button>
      <UploadCvDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
