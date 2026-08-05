"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { KeywordInput } from "./keyword-input";
import { RequiredLanguagesField } from "./required-languages-field";
import { jobPostingSchema, type JobPostingFormValues } from "@/validations/job-posting.schema";
import { GEO_CITIES, COUNTRIES } from "@/lib/geo";
import { JobModalidad, JobJornada, ExperienceLevel, AcademicLevel } from "@/generated/prisma/enums";
import {
  MODALIDAD_LABELS,
  JORNADA_LABELS,
  EXPERIENCE_LABELS,
  ACADEMIC_LABELS,
} from "@/lib/job-posting-labels";
import type { JobCategory } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/action-result";
import { createJobPostingAction, updateJobPostingAction } from "./actions";

const NONE_VALUE = "__none__";
const COUNTRY_NAMES = COUNTRIES.map((c) => c.name).sort();

interface JobPostingFormProps {
  categories: JobCategory[];
  mode: "create" | "edit";
  jobPostingId?: string;
  defaultValues?: Partial<JobPostingFormValues>;
  /** Overrides the default create/update Server Action call (e.g. for admin edits). */
  onSubmit?: (values: JobPostingFormValues) => Promise<ActionResult<{ id: string }>>;
  /** Where to redirect after a successful submit. Defaults to "/empresa/ofertas". */
  redirectTo?: string;
}

const emptyDefaults: JobPostingFormValues = {
  title: "",
  categoryId: "",
  professionalArea: "",
  modalidad: JobModalidad.PRESENCIAL,
  jornada: JobJornada.TIEMPO_COMPLETO,
  department: "",
  city: "",
  country: "",
  salaryMin: null,
  salaryMax: null,
  salaryVisible: false,
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  vacancies: 1,
  deadline: null,
  experienceLevel: null,
  academicLevel: null,
  requiresLicense: false,
  requiresOwnVehicle: false,
  travelAvailability: false,
  keywords: [],
  requiredLanguages: [],
};

function toDateInputValue(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function JobPostingForm({
  categories,
  mode,
  jobPostingId,
  defaultValues,
  onSubmit: onSubmitOverride,
  redirectTo = "/empresa/ofertas",
}: JobPostingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const categoryLabelById = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      ...emptyDefaults,
      ...defaultValues,
      deadline: defaultValues?.deadline ? (toDateInputValue(defaultValues.deadline) as never) : null,
    },
  });

  const countryValue = form.watch("country");
  const departmentValue = form.watch("department");
  const departmentsForCountry = [
    ...new Set(GEO_CITIES.filter((c) => c.country === countryValue).map((c) => c.department)),
  ].sort();
  const citiesForDepartment = GEO_CITIES.filter(
    (c) => c.country === countryValue && c.department === departmentValue
  );

  function onSubmit(values: JobPostingFormValues) {
    setFormError(null);
    startTransition(async () => {
      const result = onSubmitOverride
        ? await onSubmitOverride(values)
        : mode === "create"
          ? await createJobPostingAction(values)
          : await updateJobPostingAction(jobPostingId!, values);

      if (!result.success) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(mode === "create" ? "Oferta guardada como borrador" : "Oferta actualizada");
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel required>Título del puesto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Categoría</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una categoría">
                          {(value: string) => categoryLabelById[value] ?? "Selecciona una categoría"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área profesional</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Modalidad</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>{(value: string) => MODALIDAD_LABELS[value]}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(JobModalidad).map((value) => (
                        <SelectItem key={value} value={value}>
                          {MODALIDAD_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jornada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Jornada</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>{(value: string) => JORNADA_LABELS[value]}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(JobJornada).map((value) => (
                        <SelectItem key={value} value={value}>
                          {JORNADA_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <Select
                    value={field.value || NONE_VALUE}
                    onValueChange={(v) => {
                      const country = v === NONE_VALUE ? "" : v;
                      field.onChange(country);
                      form.setValue("department", "");
                      form.setValue("city", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un país">
                          {(value: string) =>
                            value === NONE_VALUE ? "Remoto / sin especificar" : value
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Remoto / sin especificar</SelectItem>
                      {COUNTRY_NAMES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Región (estado/provincia/departamento)</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("city", "");
                    }}
                    disabled={!countryValue}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            countryValue ? "Selecciona una región" : "Selecciona primero un país"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentsForCountry.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={!departmentValue}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            departmentValue ? "Selecciona una ciudad" : "Selecciona primero una región"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citiesForDepartment.map((c) => (
                        <SelectItem key={c.city} value={c.city}>
                          {c.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salario y plazas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salario mínimo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={(field.value as string | number | null) ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salario máximo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={(field.value as string | number | null) ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vacancies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de plazas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      value={field.value as string | number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaryVisible"
              render={({ field }) => (
                <FormItem className="flex-row items-center justify-between sm:col-span-3">
                  <FormLabel>Mostrar salario públicamente</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha límite</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={(field.value as string) ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Descripción detallada</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsabilidades</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisitos</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficios</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requisitos del candidato</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel de experiencia</FormLabel>
                  <Select
                    value={field.value ?? NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? null : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sin especificar">
                          {(value: string) =>
                            value === NONE_VALUE ? "Sin especificar" : EXPERIENCE_LABELS[value]
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Sin especificar</SelectItem>
                      {Object.values(ExperienceLevel).map((value) => (
                        <SelectItem key={value} value={value}>
                          {EXPERIENCE_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academicLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel académico</FormLabel>
                  <Select
                    value={field.value ?? NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? null : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sin especificar">
                          {(value: string) =>
                            value === NONE_VALUE ? "Sin especificar" : ACADEMIC_LABELS[value]
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Sin especificar</SelectItem>
                      {Object.values(AcademicLevel).map((value) => (
                        <SelectItem key={value} value={value}>
                          {ACADEMIC_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="sm:col-span-2">
              <FormLabel>Idiomas requeridos</FormLabel>
              <RequiredLanguagesField />
            </FormItem>

            <Controller
              control={form.control}
              name="requiresLicense"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  Licencia requerida
                </label>
              )}
            />

            <Controller
              control={form.control}
              name="requiresOwnVehicle"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  Vehículo propio
                </label>
              )}
            />

            <Controller
              control={form.control}
              name="travelAvailability"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  Disponibilidad para viajar
                </label>
              )}
            />

            <FormItem className="sm:col-span-2">
              <FormLabel>Palabras clave</FormLabel>
              <Controller
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <KeywordInput value={field.value ?? []} onChange={field.onChange} />
                )}
              />
              <FormMessage />
            </FormItem>
          </CardContent>
        </Card>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(redirectTo)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : mode === "create" ? "Guardar como borrador" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
