"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function SocialLinksField() {
  const { control, register } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <Input
            placeholder="Plataforma (ej. LinkedIn)"
            {...register(`socialLinks.${index}.platform` as const)}
            className="w-40"
          />
          <Input
            placeholder="https://..."
            {...register(`socialLinks.${index}.url` as const)}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Quitar red">
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => append({ platform: "", url: "" })}
      >
        <Plus className="size-4" />
        Agregar red social
      </Button>
    </div>
  );
}
