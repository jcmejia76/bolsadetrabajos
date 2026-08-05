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
import { mockApplications, type MockApplicationStatus } from "@/lib/mock/applications";

const STATUS_VARIANTS: Record<
  MockApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Recibida: "outline",
  "En revisión": "secondary",
  Preseleccionado: "secondary",
  Entrevista: "default",
  Rechazado: "destructive",
  Contratado: "default",
};

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

export default function PostulacionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis postulaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Da seguimiento al estado de cada empleo al que has aplicado.
        </p>
      </div>

      {mockApplications.length === 0 ? (
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
              {mockApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                        style={{ backgroundColor: application.job.companyColor }}
                      >
                        {application.job.companyInitials}
                      </span>
                      <Link
                        href={`/empleos/${application.job.slug}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {application.job.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {application.job.companyName}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[application.status]}>{application.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatRelativeDays(application.appliedDaysAgo)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={`/empleos/${application.job.slug}`} />}
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
