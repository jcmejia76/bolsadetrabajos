"use client";

import { useState, type FormEvent } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { LockIcon } from "lucide-react";

import { Role } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MaintenanceAdminLogin() {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setIsSubmitting(false);
      setError("Correo o contraseña incorrectos");
      return;
    }

    const session = await getSession();
    if (session?.user?.role !== Role.ADMINISTRADOR) {
      await signOut({ redirect: false });
      setIsSubmitting(false);
      setError("El acceso durante el mantenimiento está reservado para el administrador.");
      return;
    }

    window.location.assign("/admin");
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="relative z-10 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <LockIcon className="size-3.5" />
        Acceso de administrador
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="maintenance-email" required>Correo electrónico</Label>
        <Input
          id="maintenance-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="maintenance-password" required>Contraseña</Label>
        <Input
          id="maintenance-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
