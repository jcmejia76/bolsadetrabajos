"use client";

import { useState, useTransition } from "react";
import { UserPlusIcon, CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteStaffMemberAction } from "./actions";

export function InviteStaffDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setEmail("");
    setJobTitle("");
    setInvitationUrl(null);
    setCopied(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await inviteStaffMemberAction({ email, jobTitle });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setInvitationUrl(`${window.location.origin}${result.data.invitationUrl}`);
    });
  }

  async function handleCopy() {
    if (!invitationUrl) return;
    await navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    toast.success("Link copiado");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <UserPlusIcon className="size-4" />
        Invitar
      </DialogTrigger>
      <DialogContent>
        {invitationUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>Invitación creada</DialogTitle>
              <DialogDescription>
                Copia este link y envíaselo a {email} por el medio que prefieras (no enviamos
                correos automáticamente). El link expira en 7 días.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2.5">
              <code className="flex-1 truncate text-sm text-foreground">{invitationUrl}</code>
              <Button type="button" size="icon-sm" variant="outline" onClick={handleCopy}>
                {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Listo</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invitar a un miembro del equipo</DialogTitle>
              <DialogDescription>
                Podrá gestionar ofertas y postulaciones, pero no editar el perfil de la empresa
                ni invitar a otras personas.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="staff-email" required>
                  Correo electrónico
                </Label>
                <Input
                  id="staff-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="staff-job-title">Puesto (opcional)</Label>
                <Input
                  id="staff-job-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="ej. Reclutadora"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Generando..." : "Generar invitación"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
