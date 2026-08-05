"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobStatus } from "@/generated/prisma/enums";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_VARIANTS,
  MODALIDAD_LABELS,
  JORNADA_LABELS,
} from "@/lib/job-posting-labels";
import type { listJobPostingsByCompany } from "@/services/job-posting/job-posting.service";
import {
  submitForReviewAction,
  pauseJobPostingAction,
  resumeJobPostingAction,
  duplicateJobPostingAction,
} from "./actions";
import { DeleteJobPostingDialog } from "./delete-job-posting-dialog";

type JobPostingRow = Omit<
  Awaited<ReturnType<typeof listJobPostingsByCompany>>[number],
  "salaryMin" | "salaryMax"
> & { salaryMin: number | null; salaryMax: number | null };

export function JobPostingsTable({ jobPostings }: { jobPostings: JobPostingRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<JobPostingRow | null>(null);

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        toast.error(result.error ?? "Ocurrió un error");
        return;
      }
      toast.success("Listo");
      router.refresh();
    });
  }

  if (jobPostings.length === 0) {
    return (
      <EmptyState
        icon={<BriefcaseIcon />}
        title="Aún no has publicado ninguna oferta"
        description="Cuando publiques una vacante, podrás gestionarla desde aquí."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Título</TableHead>
            <TableHead className="px-4 py-3">Categoría</TableHead>
            <TableHead className="px-4 py-3">Modalidad / Jornada</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">Postulantes</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPostings.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">{job.title}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{job.category?.name ?? "—"}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {MODALIDAD_LABELS[job.modalidad]} · {JORNADA_LABELS[job.jornada]}
              </TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={JOB_STATUS_VARIANTS[job.status]}>{JOB_STATUS_LABELS[job.status]}</Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{job._count.applications}</TableCell>
              <TableCell className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label="Acciones">
                        <MoreVertical className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/empresa/ofertas/${job.id}/editar`} />}>
                      Editar
                    </DropdownMenuItem>
                    {(job.status === JobStatus.BORRADOR ||
                      job.status === JobStatus.RECHAZADA ||
                      job.status === JobStatus.CAMBIOS_SOLICITADOS) && (
                      <DropdownMenuItem
                        onClick={() => runAction(() => submitForReviewAction(job.id))}
                        disabled={isPending}
                      >
                        Enviar a revisión
                      </DropdownMenuItem>
                    )}
                    {job.status === JobStatus.PUBLICADA && (
                      <DropdownMenuItem
                        onClick={() => runAction(() => pauseJobPostingAction(job.id))}
                        disabled={isPending}
                      >
                        Pausar
                      </DropdownMenuItem>
                    )}
                    {job.status === JobStatus.CERRADA && (
                      <DropdownMenuItem
                        onClick={() => runAction(() => resumeJobPostingAction(job.id))}
                        disabled={isPending}
                      >
                        Reanudar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => runAction(() => duplicateJobPostingAction(job.id))}
                      disabled={isPending}
                    >
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href={`/empresa/ofertas/${job.id}/postulantes`} />}
                    >
                      Ver postulantes
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(job)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {deleteTarget && (
        <DeleteJobPostingDialog
          jobPostingId={deleteTarget.id}
          jobPostingTitle={deleteTarget.title}
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
