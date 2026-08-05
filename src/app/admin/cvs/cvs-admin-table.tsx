"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, MoreVertical } from "lucide-react";
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
import { CVStatus } from "@/generated/prisma/enums";
import { CV_STATUS_LABELS, CV_SOURCE_LABELS, CV_STATUS_VARIANTS } from "@/lib/candidate-labels";
import type { listCvsForAdmin } from "@/services/admin/cv-review.service";
import { approveCvAction, rejectCvAction, requestCvChangesAction } from "./actions";
import { ReasonDialog } from "../_components/reason-dialog";

type CvRow = Awaited<ReturnType<typeof listCvsForAdmin>>[number];

export function CvsAdminTable({ cvs }: { cvs: CvRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<CvRow | null>(null);
  const [changesTarget, setChangesTarget] = useState<CvRow | null>(null);

  function handleApprove(cvId: string) {
    startTransition(async () => {
      const result = await approveCvAction(cvId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("CV aprobado");
      router.refresh();
    });
  }

  if (cvs.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title="No hay CVs en este filtro"
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
            <TableHead className="px-4 py-3">Candidato</TableHead>
            <TableHead className="px-4 py-3">Archivo</TableHead>
            <TableHead className="px-4 py-3">Origen</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cvs.map((cv) => (
            <TableRow key={cv.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">
                {cv.candidate.firstName} {cv.candidate.lastName}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{cv.fileName}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{CV_SOURCE_LABELS[cv.sourceType]}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={CV_STATUS_VARIANTS[cv.status]}>{CV_STATUS_LABELS[cv.status]}</Badge>
              </TableCell>
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
                    <DropdownMenuItem render={<a href={cv.fileUrl} target="_blank" rel="noopener noreferrer" />}>
                      Ver archivo
                    </DropdownMenuItem>
                    {cv.status === CVStatus.PENDIENTE && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(cv.id)} disabled={isPending}>
                          Aprobar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setChangesTarget(cv)}>
                          Solicitar cambios
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRejectTarget(cv)}>
                          Rechazar
                        </DropdownMenuItem>
                      </>
                    )}
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
          title={`Rechazar CV de ${rejectTarget.candidate.firstName} ${rejectTarget.candidate.lastName}`}
          confirmLabel="Rechazar"
          onConfirm={(reason) => rejectCvAction(rejectTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
      {changesTarget && (
        <ReasonDialog
          open={!!changesTarget}
          onOpenChange={(open) => !open && setChangesTarget(null)}
          title={`Solicitar cambios en el CV de ${changesTarget.candidate.firstName} ${changesTarget.candidate.lastName}`}
          confirmLabel="Solicitar cambios"
          onConfirm={(reason) => requestCvChangesAction(changesTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
    </>
  );
}
