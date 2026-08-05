"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import { CV_STATUS_LABELS, CV_SOURCE_LABELS, CV_STATUS_VARIANTS } from "@/lib/candidate-labels";
import type { listCvsByCandidate } from "@/services/cv/cv.service";
import { setPrimaryCvAction } from "./actions";
import { DeleteCvDialog } from "./delete-cv-dialog";

type CvRow = Awaited<ReturnType<typeof listCvsByCandidate>>[number];

export function CvTable({ cvs }: { cvs: CvRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<CvRow | null>(null);

  function handleSetPrimary(cvId: string) {
    startTransition(async () => {
      const result = await setPrimaryCvAction(cvId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("CV marcado como principal");
      router.refresh();
    });
  }

  if (cvs.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title="Aún no has subido ni generado ningún CV"
        description="Sube un archivo o genera uno automáticamente desde tu perfil."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Archivo</TableHead>
            <TableHead className="px-4 py-3">Origen</TableHead>
            <TableHead className="px-4 py-3">Versión</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">Principal</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cvs.map((cv) => (
            <TableRow key={cv.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">{cv.fileName}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{CV_SOURCE_LABELS[cv.sourceType]}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">v{cv.version}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={CV_STATUS_VARIANTS[cv.status]}>{CV_STATUS_LABELS[cv.status]}</Badge>
              </TableCell>
              <TableCell className="px-4 py-3">{cv.isPrimary ? <Badge>Principal</Badge> : "—"}</TableCell>
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
                    <DropdownMenuItem render={<Link href={`/candidato/cv/${cv.id}`} />}>
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<a href={cv.fileUrl} download={cv.fileName} />}
                    >
                      Descargar
                    </DropdownMenuItem>
                    {!cv.isPrimary && (
                      <DropdownMenuItem onClick={() => handleSetPrimary(cv.id)} disabled={isPending}>
                        Marcar como principal
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(cv)}>
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
        <DeleteCvDialog
          cvId={deleteTarget.id}
          cvFileName={deleteTarget.fileName}
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
