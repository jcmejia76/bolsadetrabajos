import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CheckCircle2Icon, ClockIcon, EyeIcon, UsersIcon } from "lucide-react";

import { requireCompanySession } from "@/lib/auth-utils";
import { getJobPostingForCompany } from "@/services/job-posting/job-posting.service";
import { listApplicationsForJobPosting } from "@/services/application/application.service";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApplicantsTable } from "./applicants-table";

export default async function PostulantesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { companyId } = await requireCompanySession();

  const jobPosting = await getJobPostingForCompany(companyId, id);
  if (!jobPosting) notFound();

  const applications = await listApplicationsForJobPosting(companyId, id);

  const statCards = [
    { label: "Vistas de la oferta", value: jobPosting.viewsCount, icon: EyeIcon },
    { label: "Postulantes totales", value: applications.length, icon: UsersIcon },
    {
      label: "En revisión",
      value: applications.filter((a) => a.status === "EN_REVISION" || a.status === "RECIBIDA").length,
      icon: ClockIcon,
    },
    {
      label: "Contratados",
      value: applications.filter((a) => a.status === "CONTRATADO").length,
      icon: CheckCircle2Icon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/empresa/ofertas"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Volver a mis ofertas
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{jobPosting.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Postulantes y estadísticas de esta oferta</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={<stat.icon />} />
        ))}
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<UsersIcon />}
          title="Aún no hay postulantes para esta oferta"
          description="Cuando alguien aplique, sus datos y CV aparecerán aquí."
        />
      ) : (
        <ApplicantsTable jobPostingId={id} applications={applications} />
      )}
    </div>
  );
}
