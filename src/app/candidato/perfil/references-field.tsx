"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function ReferencesField() {
  const { control, register } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "references" });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Nombre" {...register(`references.${index}.name` as const)} />
            <Input
              placeholder="Relación (ej. Jefe directo)"
              {...register(`references.${index}.relationship` as const)}
            />
            <Input placeholder="Teléfono" {...register(`references.${index}.phone` as const)} />
            <Input placeholder="Correo" {...register(`references.${index}.email` as const)} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit text-destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="size-4" />
            Quitar
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => append({ name: "", relationship: "", phone: "", email: "" })}
      >
        <Plus className="size-4" />
        Agregar referencia
      </Button>
    </div>
  );
}
