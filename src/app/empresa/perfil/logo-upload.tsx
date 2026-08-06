"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadCompanyLogoAction, removeCompanyLogoAction } from "./actions";

interface LogoUploadProps {
  logoUrl: string | null;
  initials: string | null;
}

export function LogoUpload({ logoUrl, initials }: LogoUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadCompanyLogoAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setPreviewUrl(result.data.logoUrl);
      toast.success("Logo actualizado");
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCompanyLogoAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setPreviewUrl(null);
      toast.success("Logo eliminado");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg" className="size-16 rounded-lg">
        {previewUrl && <AvatarImage src={previewUrl} alt="Logo de la empresa" />}
        <AvatarFallback className="rounded-lg">{initials || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          Cambiar logo
        </Button>
        {previewUrl && (
          <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={handleRemove}>
            Quitar
          </Button>
        )}
      </div>
    </div>
  );
}
