"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AvatarUpload } from "./avatar-upload";
import { SkillsInput } from "./skills-input";
import { WorkExperienceField } from "./work-experience-field";
import { EducationField } from "./education-field";
import { CertificationsField } from "./certifications-field";
import { LanguagesField } from "./languages-field";
import { SocialLinksField } from "./social-links-field";
import { ReferencesField } from "./references-field";
import { GENDER_OPTIONS, AVAILABILITY_OPTIONS } from "@/lib/candidate-labels";
import {
  candidateProfileSchema,
  type CandidateProfileFormValues,
} from "@/validations/candidate.schema";
import { updateCandidateProfileAction } from "./actions";

const NONE_VALUE = "__none__";

interface CandidateProfileFormProps {
  email: string;
  photoUrl: string | null;
  defaultValues: CandidateProfileFormValues;
}

export function CandidateProfileForm({ email, photoUrl, defaultValues }: CandidateProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues,
  });

  function onSubmit(values: CandidateProfileFormValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await updateCandidateProfileAction(values);
      if (!result.success) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Perfil actualizado");
      router.refresh();
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foto de perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              photoUrl={photoUrl}
              firstName={form.watch("firstName")}
              lastName={form.watch("lastName")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <Input value={email} disabled />
            </FormItem>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
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
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género (opcional)</FormLabel>
                  <Select
                    value={field.value || NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sin especificar">
                          {(value: string) => (value === NONE_VALUE ? "Sin especificar" : value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Sin especificar</SelectItem>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nacionalidad</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil profesional</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profesión</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad</FormLabel>
                  <Select
                    value={field.value || NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sin especificar">
                          {(value: string) => (value === NONE_VALUE ? "Sin especificar" : value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Sin especificar</SelectItem>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name="salaryAspiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aspiración salarial</FormLabel>
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
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portafolio (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Sobre mí</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="sm:col-span-2">
              <FormLabel>Habilidades</FormLabel>
              <Controller
                control={form.control}
                name="skills"
                render={({ field }) => <SkillsInput value={field.value ?? []} onChange={field.onChange} />}
              />
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="isProfilePublic"
              render={({ field }) => (
                <FormItem className="flex-row items-center justify-between sm:col-span-2">
                  <FormLabel>Perfil visible públicamente</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiencia laboral</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkExperienceField />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Educación</CardTitle>
          </CardHeader>
          <CardContent>
            <EducationField />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificationsField />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Idiomas</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguagesField />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialLinksField />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referencias</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferencesField />
          </CardContent>
        </Card>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
