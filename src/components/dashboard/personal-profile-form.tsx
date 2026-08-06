"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { personalProfileSchema, type PersonalProfileInput } from "@/validations/user.schema";
import { updateUserProfileAction } from "@/lib/actions/user-profile";
import { PersonalPhotoUpload } from "./personal-photo-upload";

interface PersonalProfileFormProps {
  email: string;
  photoUrl: string | null;
  defaultValues: PersonalProfileInput;
}

function deriveInitials(firstName: string, lastName: string, email: string): string {
  const combined = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return combined || email[0]?.toUpperCase() || "?";
}

export function PersonalProfileForm({ email, photoUrl, defaultValues }: PersonalProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PersonalProfileInput>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues,
  });

  function onSubmit(values: PersonalProfileInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await updateUserProfileAction(values);
      if (!result.success) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Perfil actualizado");
    });
  }

  const firstName = form.watch("firstName") ?? "";
  const lastName = form.watch("lastName") ?? "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Datos personales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <PersonalPhotoUpload photoUrl={photoUrl} initials={deriveInitials(firstName, lastName, email)} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
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
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input value={email} disabled />
                </FormControl>
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
            </div>

            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobre mí</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
