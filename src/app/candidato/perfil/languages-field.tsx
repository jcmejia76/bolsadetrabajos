"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageLevel } from "@/generated/prisma/enums";
import { LANGUAGE_LEVEL_LABELS } from "@/lib/job-posting-labels";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function LanguagesField() {
  const { control, register } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "languages" });

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input
            placeholder="Idioma (ej. Inglés)"
            {...register(`languages.${index}.language` as const)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`languages.${index}.level` as const}
              render={({ field: levelField }) => (
                <Select value={levelField.value} onValueChange={levelField.onChange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Nivel">
                      {(value: string) => LANGUAGE_LEVEL_LABELS[value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LanguageLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {LANGUAGE_LEVEL_LABELS[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => remove(index)}
              aria-label="Quitar idioma"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => append({ language: "", level: LanguageLevel.INTERMEDIO })}
      >
        <Plus className="size-4" />
        Agregar idioma
      </Button>
    </div>
  );
}
