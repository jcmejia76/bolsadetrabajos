import Link from "next/link";
import { SendIcon } from "lucide-react";
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
import { ApplicationStatus } from "@/generated/prisma/enums";
import { APPLICATION_STATUS_LABELS } from "@/lib/application-labels";
import { listApplicationsForAdmin } from "@/services/admin/application-review.service";
import { ApplicationsFilterBar } from "./applications-filter-bar";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [ApplicationStatus.RECIBIDA]: "outline",
  [ApplicationStatus.EN_REVISION]: "secondary",
  [ApplicationStatus.VISTA]: "secondary",
  [ApplicationStatus.PRESELECCIONADO]: "secondary",
  [ApplicationStatus.ENTREVISTA]: "secondary",
  [ApplicationStatus.RECHAZADO]: "destructive",
  [ApplicationStatus.CONTRATADO]: "default",
};

export default async function AdminPostulacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const activeStatus = Object.values(ApplicationStatus).includes(status as ApplicationStatus)
    ? (status as ApplicationStatus)
    : undefined;
  const currentPage = Math.max(1, Number(page) || 1);

  const { applications, total, totalPages } = await listApplicationsForAdmin(
    { status: activeStatus },
    currentPage
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Postulaciones ({total})
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta todas las postulaciones recibidas en la plataforma.
        </p>
      </div>

      <ApplicationsFilterBar />

      {applications.length === 0 ? (
        <EmptyState
          icon={<SendIcon />}
          title="No hay postulaciones en este filtro"
          description="Prueba con otro estado o vuelve más tarde."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-3">Candidato</TableHead>
                <TableHead className="px-4 py-3">Oferta</TableHead>
                <TableHead className="px-4 py-3">Empresa</TableHead>
                <TableHead className="px-4 py-3">Estado</TableHead>
                <TableHead className="px-4 py-3">Postulado el</TableHead>
                <TableHead className="px-4 py-3 text-right">CV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {application.candidate.firstName} {application.candidate.lastName}
                  </TableCell>
                  <TableCell className="px-4 py-3">{application.jobPosting.title}</TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {application.jobPosting.company.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[application.status]}>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {new Date(application.appliedAt).toLocaleDateString("es")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <a
                      href={application.cv.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      Ver
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage <= 1 ? (
                <Button variant="outline" disabled>
                  Anterior
                </Button>
              ) : (
                <Button
                  variant="outline"
                  render={
                    <Link
                      href={`/admin/postulaciones?page=${currentPage - 1}${activeStatus ? `&status=${activeStatus}` : ""}`}
                    />
                  }
                  nativeButton={false}
                >
                  Anterior
                </Button>
              )}
              {currentPage >= totalPages ? (
                <Button variant="outline" disabled>
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="outline"
                  render={
                    <Link
                      href={`/admin/postulaciones?page=${currentPage + 1}${activeStatus ? `&status=${activeStatus}` : ""}`}
                    />
                  }
                  nativeButton={false}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
