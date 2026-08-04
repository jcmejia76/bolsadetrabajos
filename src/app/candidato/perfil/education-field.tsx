"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function EducationField() {
  const { control, register, watch } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "educations" });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const isCurrent = watch(`educations.${index}.isCurrent`);
        return (
          <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Institución"
                {...register(`educations.${index}.institution` as const)}
              />
              <Input placeholder="Título/Grado" {...register(`educations.${index}.degree` as const)} />
              <Input
                placeholder="Área de estudio"
                {...register(`educations.${index}.fieldOfStudy` as const)}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="date"
                  {...register(`educations.${index}.startDate` as const, {
                    setValueAs: (v) => (v === "" ? null : v),
                  })}
                />
                <Input
                  type="date"
                  disabled={!!isCurrent}
                  {...register(`educations.${index}.endDate` as const, {
                    setValueAs: (v) => (v === "" ? null : v),
                  })}
                />
              </div>
            </div>
            <Controller
              control={control}
              name={`educations.${index}.isCurrent` as const}
              render={({ field: currentField }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={currentField.value}
                    onCheckedChange={currentField.onChange}
                  />
                  En curso
                </label>
              )}
            />
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
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() =>
          append({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: null,
            endDate: null,
            isCurrent: false,
          })
        }
      >
        <Plus className="size-4" />
        Agregar educación
      </Button>
    </div>
  );
}
