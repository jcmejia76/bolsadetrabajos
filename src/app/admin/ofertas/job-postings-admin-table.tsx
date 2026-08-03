"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobStatus } from "@/generated/prisma/enums";
import { JOB_STATUS_LABELS, JOB_STATUS_VARIANTS } from "@/lib/job-posting-labels";
import type { listJobPostingsForAdmin } from "@/services/admin/job-review.service";
import {
  approveJobPostingAction,
  rejectJobPostingAction,
  requestJobPostingChangesAction,
  toggleJobPostingFeaturedAction,
} from "./actions";
import { ReasonDialog } from "../_components/reason-dialog";

type JobRow = Awaited<ReturnType<typeof listJobPostingsForAdmin>>[number];

export function JobPostingsAdminTable({ jobPostings }: { jobPostings: JobRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<JobRow | null>(null);
  const [changesTarget, setChangesTarget] = useState<JobRow | null>(null);

  function handleApprove(jobPostingId: string) {
    startTransition(async () => {
      const result = await approveJobPostingAction(jobPostingId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Oferta aprobada");
      router.refresh();
    });
  }

  function handleToggleFeatured(jobPostingId: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleJobPostingFeaturedAction(jobPostingId, !current);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(current ? "Ya no está destacada" : "Oferta destacada");
      router.refresh();
    });
  }

  if (jobPostings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        No hay ofertas en este filtro.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Destacada</TableHead>
            <TableHead>Postulantes</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPostings.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell className="text-muted-foreground">{job.company.name}</TableCell>
              <TableCell>
                <Badge variant={JOB_STATUS_VARIANTS[job.status]}>{JOB_STATUS_LABELS[job.status]}</Badge>
              </TableCell>
              <TableCell>{job.isFeatured ? <Badge>Destacada</Badge> : "—"}</TableCell>
              <TableCell>{job._count.applications}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" aria-label="Acciones">
                        <MoreVertical className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/admin/ofertas/${job.id}`} />}>
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href={`/admin/ofertas/${job.id}/editar`} />}>
                      Editar
                    </DropdownMenuItem>
                    {job.status === JobStatus.PENDIENTE_APROBACION && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(job.id)} disabled={isPending}>
                          Aprobar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setChangesTarget(job)}>
                          Solicitar cambios
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRejectTarget(job)}>
                          Rechazar
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleToggleFeatured(job.id, job.isFeatured)}
                      disabled={isPending}
                    >
                      {job.isFeatured ? "Quitar destacado" : "Destacar"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {rejectTarget && (
        <ReasonDialog
          open={!!rejectTarget}
          onOpenChange={(open) => !open && setRejectTarget(null)}
          title={`Rechazar "${rejectTarget.title}"`}
          confirmLabel="Rechazar"
          onConfirm={(reason) => rejectJobPostingAction(rejectTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
      {changesTarget && (
        <ReasonDialog
          open={!!changesTarget}
          onOpenChange={(open) => !open && setChangesTarget(null)}
          title={`Solicitar cambios en "${changesTarget.title}"`}
          confirmLabel="Solicitar cambios"
          onConfirm={(reason) => requestJobPostingChangesAction(changesTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
    </>
  );
}
