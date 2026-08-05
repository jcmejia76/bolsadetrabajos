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
import { JOB_STATUS_LABELS, JOB_STATUS_VARIANTS } from "@/lib/job-posting-labels";
import type { listJobPostingsForAdmin } from "@/services/admin/job-review.service";
import {
  approveJobPostingAction,
  rejectJobPostingAction,
  requestJobPostingChangesAction,
  toggleJobPostingFeaturedAction,
} from "./actions";
import { ReasonDialog } from "../_components/reason-dialog";

type JobRow = Awaited<ReturnType<typeof listJobPostingsForAdmin>>["jobPostings"][number];

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
      <EmptyState
        icon={<BriefcaseIcon />}
        title="No hay ofertas en este filtro"
        description="Prueba con otro estado o vuelve más tarde."
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
            <TableHead className="px-4 py-3">Empresa</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">Destacada</TableHead>
            <TableHead className="px-4 py-3">Postulantes</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPostings.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">{job.title}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{job.company.name}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={JOB_STATUS_VARIANTS[job.status]}>{JOB_STATUS_LABELS[job.status]}</Badge>
              </TableCell>
              <TableCell className="px-4 py-3">{job.isFeatured ? <Badge>Destacada</Badge> : "—"}</TableCell>
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
      </div>

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
