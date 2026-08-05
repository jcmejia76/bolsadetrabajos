import Link from "next/link";
import { SendIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireCandidateSession } from "@/lib/auth-utils";
import { listApplicationsByCandidate } from "@/services/application/application.service";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_VARIANTS } from "@/lib/application-labels";

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

function daysSince(date: Date) {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

export default async function PostulacionesPage() {
  const { candidateId } = await requireCandidateSession();
  const applications = await listApplicationsByCandidate(candidateId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis postulaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Da seguimiento al estado de cada empleo al que has aplicado.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<SendIcon />}
          title="Aún no has aplicado a ninguna vacante"
          description="Explora empleos disponibles y aplica en segundos."
          action={
            <Button render={<Link href="/empleos" />} nativeButton={false}>
              Buscar empleos
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-3">Empleo</TableHead>
                <TableHead className="px-4 py-3">Empresa</TableHead>
                <TableHead className="px-4 py-3">Estado</TableHead>
                <TableHead className="px-4 py-3">Postulado</TableHead>
                <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                        style={{ backgroundColor: application.jobPosting.company.color ?? "oklch(0.56 0.17 258)" }}
                      >
                        {application.jobPosting.company.initials ?? "?"}
                      </span>
                      <Link
                        href={`/empleos/${application.jobPosting.slug}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {application.jobPosting.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {application.jobPosting.company.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={APPLICATION_STATUS_VARIANTS[application.status]}>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatRelativeDays(daysSince(application.appliedAt))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={`/empleos/${application.jobPosting.slug}`} />}
                      nativeButton={false}
                    >
                      Ver oferta
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
