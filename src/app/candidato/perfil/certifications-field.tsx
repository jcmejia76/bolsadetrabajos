"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CandidateProfileFormValues } from "@/validations/candidate.schema";

export function CertificationsField() {
  const { control, register } = useFormContext<CandidateProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Nombre de la certificación"
              {...register(`certifications.${index}.name` as const)}
            />
            <Input
              placeholder="Emisor"
              {...register(`certifications.${index}.issuer` as const)}
            />
            <Input
              type="date"
              {...register(`certifications.${index}.issuedAt` as const, {
                setValueAs: (v) => (v === "" ? null : v),
              })}
            />
            <Input
              type="date"
              {...register(`certifications.${index}.expiresAt` as const, {
                setValueAs: (v) => (v === "" ? null : v),
              })}
            />
            <Input
              placeholder="URL de la credencial"
              className="sm:col-span-2"
              {...register(`certifications.${index}.credentialUrl` as const)}
            />
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
        onClick={() =>
          append({ name: "", issuer: "", issuedAt: null, expiresAt: null, credentialUrl: "" })
        }
      >
        <Plus className="size-4" />
        Agregar certificación
      </Button>
    </div>
  );
}
