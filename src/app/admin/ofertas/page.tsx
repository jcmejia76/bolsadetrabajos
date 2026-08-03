import Link from "next/link";
import { cn } from "@/lib/utils";
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
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const hasStatusParam = status !== undefined;
  const activeStatus = Object.values(JobStatus).includes(status as JobStatus)
    ? (status as JobStatus)
    : hasStatusParam
      ? undefined
      : JobStatus.PENDIENTE_APROBACION;

  const jobPostings = await listJobPostingsForAdmin({ status: activeStatus });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Gestión de Ofertas</h2>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/ofertas?status=${filter.value}` : "/admin/ofertas?status=all"}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              activeStatus === filter.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <JobPostingsAdminTable jobPostings={jobPostings} />
    </div>
  );
}
