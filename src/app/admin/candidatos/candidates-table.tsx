"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, UsersIcon } from "lucide-react";
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
import type { listCandidatesForAdmin } from "@/services/admin/candidate-admin.service";
import { suspendCandidateAction, reactivateCandidateAction } from "./actions";
import { DeleteCandidateDialog } from "./delete-candidate-dialog";

type CandidateRow = Awaited<ReturnType<typeof listCandidatesForAdmin>>["candidates"][number];

export function CandidatesTable({ candidates }: { candidates: CandidateRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<CandidateRow | null>(null);

  function handleSuspend(candidateId: string) {
    startTransition(async () => {
      const result = await suspendCandidateAction(candidateId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Candidato suspendido");
      router.refresh();
    });
  }

  function handleReactivate(candidateId: string) {
    startTransition(async () => {
      const result = await reactivateCandidateAction(candidateId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Candidato reactivado");
      router.refresh();
    });
  }

  if (candidates.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon />}
        title="No hay candidatos registrados"
        description="Los nuevos registros aparecerán aquí."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Nombre</TableHead>
            <TableHead className="px-4 py-3">Correo</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">CVs</TableHead>
            <TableHead className="px-4 py-3">Postulaciones</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">
                {candidate.firstName} {candidate.lastName}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{candidate.user.email}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={candidate.user.isActive ? "default" : "destructive"}>
                  {candidate.user.isActive ? "Activo" : "Suspendido"}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{candidate._count.cvs}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{candidate._count.applications}</TableCell>
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
                    {candidate.user.isActive ? (
                      <DropdownMenuItem onClick={() => handleSuspend(candidate.id)} disabled={isPending}>
                        Suspender
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleReactivate(candidate.id)} disabled={isPending}>
                        Reactivar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(candidate)}>
                      Eliminar perfil
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
        <DeleteCandidateDialog
          candidateId={deleteTarget.id}
          candidateName={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
