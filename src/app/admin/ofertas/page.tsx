import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { listJobPostingsForAdmin } from "@/services/admin/job-review.service";
import { JobStatus } from "@/generated/prisma/enums";
import { JobPostingsAdminTable } from "./job-postings-admin-table";

const STATUS_FILTERS: { label: string; value?: JobStatus }[] = [
  { label: "Pendientes", value: JobStatus.PENDIENTE_APROBACION },
  { label: "Todas" },
  { label: "Publicadas", value: JobStatus.PUBLICADA },
  { label: "Rechazadas", value: JobStatus.RECHAZADA },
  { label: "Cambios solicitados", value: JobStatus.CAMBIOS_SOLICITADOS },
  { label: "Cerradas", value: JobStatus.CERRADA },
];

export default async function AdminOfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const hasStatusParam = status !== undefined;
  const activeStatus = Object.values(JobStatus).includes(status as JobStatus)
    ? (status as JobStatus)
    : hasStatusParam
      ? undefined
      : JobStatus.PENDIENTE_APROBACION;
  const currentPage = Math.max(1, Number(page) || 1);

  const { jobPostings, totalPages } = await listJobPostingsForAdmin(
    { status: activeStatus },
    currentPage
  );

  const statusQuery = activeStatus ? `status=${activeStatus}` : hasStatusParam ? "status=all" : "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Gestión de Ofertas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa, aprueba y modera las vacantes publicadas por las empresas.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/ofertas?status=${filter.value}` : "/admin/ofertas?status=all"}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeStatus === filter.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <JobPostingsAdminTable jobPostings={jobPostings} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {Math.max(1, totalPages)}
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
                <Link href={`/admin/ofertas?page=${currentPage - 1}${statusQuery ? `&${statusQuery}` : ""}`} />
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
                <Link href={`/admin/ofertas?page=${currentPage + 1}${statusQuery ? `&${statusQuery}` : ""}`} />
              }
              nativeButton={false}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
