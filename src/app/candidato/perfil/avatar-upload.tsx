"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { uploadCandidatePhotoAction, removeCandidatePhotoAction } from "./actions";

interface AvatarUploadProps {
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}

export function AvatarUpload({ photoUrl, firstName, lastName }: AvatarUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadCandidatePhotoAction(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setPreviewUrl(result.data.photoUrl);
      toast.success("Foto actualizada");
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCandidatePhotoAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setPreviewUrl(null);
      toast.success("Foto eliminada");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg" className="size-16">
        {previewUrl && <AvatarImage src={previewUrl} alt="Foto de perfil" />}
        <AvatarFallback>{initials || "?"}</AvatarFallback>
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
          Cambiar foto
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
