"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function WorkExperienceField() {
  const { control, register, watch } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "workExperiences" });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const isCurrent = watch(`workExperiences.${index}.isCurrent`);
        return (
          <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Empresa"
                {...register(`workExperiences.${index}.company` as const)}
              />
              <Input
                placeholder="Puesto"
                {...register(`workExperiences.${index}.position` as const)}
              />
              <Input type="date" {...register(`workExperiences.${index}.startDate` as const)} />
              <Input
                type="date"
                disabled={!!isCurrent}
                {...register(`workExperiences.${index}.endDate` as const, {
                  setValueAs: (v) => (v === "" ? null : v),
                })}
              />
            </div>
            <Controller
              control={control}
              name={`workExperiences.${index}.isCurrent` as const}
              render={({ field: currentField }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={currentField.value}
                    onCheckedChange={currentField.onChange}
                  />
                  Trabajo actual
                </label>
              )}
            />
            <Textarea
              placeholder="Descripción de responsabilidades..."
              rows={2}
              {...register(`workExperiences.${index}.description` as const)}
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
            company: "",
            position: "",
            startDate: new Date().toISOString().slice(0, 10) as unknown as Date,
            endDate: null,
            isCurrent: false,
            description: "",
          })
        }
      >
        <Plus className="size-4" />
        Agregar experiencia
      </Button>
    </div>
  );
}
