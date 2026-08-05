import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireCompanySession } from "@/lib/auth-utils";
import { listJobPostingsByCompany } from "@/services/job-posting/job-posting.service";
import { JobStatus } from "@/generated/prisma/enums";
import { JobPostingsTable } from "./job-postings-table";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value?: JobStatus }[] = [
  { label: "Todas" },
  { label: "Borrador", value: JobStatus.BORRADOR },
  { label: "Pendientes", value: JobStatus.PENDIENTE_APROBACION },
  { label: "Publicadas", value: JobStatus.PUBLICADA },
  { label: "Cerradas", value: JobStatus.CERRADA },
  { label: "Rechazadas", value: JobStatus.RECHAZADA },
];

export default async function OfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { companyId } = await requireCompanySession();

  const activeStatus = Object.values(JobStatus).includes(status as JobStatus)
    ? (status as JobStatus)
    : undefined;

  const jobPostings = (await listJobPostingsByCompany(companyId, activeStatus)).map((job) => ({
    ...job,
    salaryMin: job.salaryMin ? Number(job.salaryMin) : null,
    salaryMax: job.salaryMax ? Number(job.salaryMax) : null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis ofertas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona y da seguimiento a tus vacantes publicadas.
          </p>
        </div>
        <Button render={<Link href="/empresa/ofertas/nueva" />} nativeButton={false}>
          Publicar nueva oferta
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/empresa/ofertas?status=${filter.value}` : "/empresa/ofertas"}
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

      <JobPostingsTable jobPostings={jobPostings} />
    </div>
  );
}
