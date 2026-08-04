"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2Icon, MoreVertical } from "lucide-react";
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
import { CompanyStatus } from "@/generated/prisma/enums";
import { COMPANY_STATUS_LABELS, COMPANY_STATUS_VARIANTS } from "@/lib/company-labels";
import type { listCompanies } from "@/services/company/company.service";
import { approveCompanyAction, rejectCompanyAction, suspendCompanyAction } from "./actions";
import { ReasonDialog } from "../_components/reason-dialog";
import { DeleteCompanyDialog } from "./delete-company-dialog";

type CompanyRow = Awaited<ReturnType<typeof listCompanies>>[number];

export function CompaniesTable({ companies }: { companies: CompanyRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<CompanyRow | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<CompanyRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompanyRow | null>(null);

  function handleApprove(companyId: string) {
    startTransition(async () => {
      const result = await approveCompanyAction(companyId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Empresa aprobada");
      router.refresh();
    });
  }

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={<Building2Icon />}
        title="No hay empresas en este filtro"
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
            <TableHead className="px-4 py-3">Nombre</TableHead>
            <TableHead className="px-4 py-3">Industria</TableHead>
            <TableHead className="px-4 py-3">Estado</TableHead>
            <TableHead className="px-4 py-3">Ofertas</TableHead>
            <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="px-4 py-3 font-medium text-foreground">{company.name}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{company.industry ?? "—"}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={COMPANY_STATUS_VARIANTS[company.status]}>
                  {COMPANY_STATUS_LABELS[company.status]}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{company._count.jobPostings}</TableCell>
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
                    <DropdownMenuItem render={<Link href={`/admin/empresas/${company.id}`} />}>
                      Ver
                    </DropdownMenuItem>
                    {company.status === CompanyStatus.PENDIENTE && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleApprove(company.id)}
                          disabled={isPending}
                        >
                          Aprobar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRejectTarget(company)}>
                          Rechazar
                        </DropdownMenuItem>
                      </>
                    )}
                    {company.status === CompanyStatus.APROBADA && (
                      <DropdownMenuItem onClick={() => setSuspendTarget(company)}>
                        Suspender
                      </DropdownMenuItem>
                    )}
                    {(company.status === CompanyStatus.SUSPENDIDA ||
                      company.status === CompanyStatus.RECHAZADA) && (
                      <DropdownMenuItem onClick={() => handleApprove(company.id)} disabled={isPending}>
                        Reactivar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(company)}>
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

      {rejectTarget && (
        <ReasonDialog
          open={!!rejectTarget}
          onOpenChange={(open) => !open && setRejectTarget(null)}
          title={`Rechazar "${rejectTarget.name}"`}
          confirmLabel="Rechazar"
          onConfirm={(reason) => rejectCompanyAction(rejectTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
      {suspendTarget && (
        <ReasonDialog
          open={!!suspendTarget}
          onOpenChange={(open) => !open && setSuspendTarget(null)}
          title={`Suspender "${suspendTarget.name}"`}
          confirmLabel="Suspender"
          onConfirm={(reason) => suspendCompanyAction(suspendTarget.id, reason)}
          onConfirmed={() => router.refresh()}
        />
      )}
      {deleteTarget && (
        <DeleteCompanyDialog
          companyId={deleteTarget.id}
          companyName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onDeleted={() => router.refresh()}
        />
      )}
    </>
  );
}
