"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationStatus } from "@/generated/prisma/enums";
import type { listApplicationsForJobPosting } from "@/services/application/application.service";
import { updateApplicationStatusAction, addApplicationNoteAction } from "./actions";

type Application = Awaited<ReturnType<typeof listApplicationsForJobPosting>>[number];

const STATUS_LABELS: Record<string, string> = {
  [ApplicationStatus.RECIBIDA]: "Recibida",
  [ApplicationStatus.EN_REVISION]: "En revisión",
  [ApplicationStatus.VISTA]: "Vista",
  [ApplicationStatus.PRESELECCIONADO]: "Preseleccionado",
  [ApplicationStatus.ENTREVISTA]: "Entrevista",
  [ApplicationStatus.RECHAZADO]: "Rechazado",
  [ApplicationStatus.CONTRATADO]: "Contratado",
};

export function ApplicantsTable({
  jobPostingId,
  applications,
}: {
  jobPostingId: string;
  applications: Application[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notesTarget, setNotesTarget] = useState<Application | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  function handleStatusChange(applicationId: string, status: string) {
    startTransition(async () => {
      const result = await updateApplicationStatusAction(jobPostingId, { applicationId, status });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Estado actualizado");
      router.refresh();
    });
  }

  function handleAddNote() {
    if (!notesTarget || !noteDraft.trim()) return;
    startTransition(async () => {
      const result = await addApplicationNoteAction(jobPostingId, {
        applicationId: notesTarget.id,
        note: noteDraft.trim(),
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setNoteDraft("");
      toast.success("Nota agregada");
      router.refresh();
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Candidato</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">CV</TableHead>
            <TableHead className="px-4 py-3">Postulado el</TableHead>
            <TableHead className="px-4 py-3 text-right">Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">
                {application.candidate.firstName} {application.candidate.lastName}
              </TableCell>
              <TableCell className="px-4 py-3">
                <Select
                  value={application.status}
                  onValueChange={(value) => value && handleStatusChange(application.id, value)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue>{(value: string) => STATUS_LABELS[value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ApplicationStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="px-4 py-3">
                <a
                  href={application.cv.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Descargar
                </a>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {new Date(application.appliedAt).toLocaleDateString("es")}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" onClick={() => setNotesTarget(application)}>
                  Notas ({application.notes.length})
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <Dialog open={!!notesTarget} onOpenChange={(open) => !open && setNotesTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Notas internas
              {notesTarget && ` — ${notesTarget.candidate.firstName} ${notesTarget.candidate.lastName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex max-h-60 flex-col gap-3 overflow-y-auto">
            {notesTarget?.notes.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin notas todavía.</p>
            )}
            {notesTarget?.notes.map((note) => (
              <div key={note.id} className="rounded-md border p-2 text-sm">
                <p>{note.note}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {note.author.email} · {new Date(note.createdAt).toLocaleString("es")}
                </p>
              </div>
            ))}
          </div>

          <Textarea
            placeholder="Agregar una nota interna..."
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
          />

          <DialogFooter>
            <Button onClick={handleAddNote} disabled={isPending || !noteDraft.trim()}>
              Agregar nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
