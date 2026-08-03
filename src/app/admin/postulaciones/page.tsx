import Link from "next/link";
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
import { ApplicationStatus } from "@/generated/prisma/enums";
import { APPLICATION_STATUS_LABELS } from "@/lib/application-labels";
import { listApplicationsForAdmin } from "@/services/admin/application-review.service";
import { ApplicationsFilterBar } from "./applications-filter-bar";

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Postulaciones ({total})</h2>
        <ApplicationsFilterBar />
      </div>

      {applications.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No hay postulaciones en este filtro.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Oferta</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Postulado el</TableHead>
                <TableHead className="text-right">CV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.candidate.firstName} {application.candidate.lastName}
                  </TableCell>
                  <TableCell>{application.jobPosting.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {application.jobPosting.company.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{APPLICATION_STATUS_LABELS[application.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(application.appliedAt).toLocaleDateString("es")}
                  </TableCell>
                  <TableCell className="text-right">
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
