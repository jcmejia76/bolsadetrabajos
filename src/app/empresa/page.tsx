import Link from "next/link";
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileEditIcon,
  FilesIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { requireCompanySession } from "@/lib/auth-utils";
import {
  getCompanyDashboardStats,
  listJobPostingsByCompany,
  getCompanyJobsByCategory,
  getCompanyApplicationsByDay,
} from "@/services/job-posting/job-posting.service";
import { JOB_STATUS_LABELS, JOB_STATUS_VARIANTS } from "@/lib/job-posting-labels";
import { JobsByCategoryChart } from "@/app/admin/_components/charts/jobs-by-category-chart";
import { ApplicationsByDayChart } from "@/app/admin/_components/charts/applications-by-day-chart";

export default async function EmpresaDashboardPage() {
  const { companyId } = await requireCompanySession();
  const [stats, jobPostings, jobsByCategory, applicationsByDay] = await Promise.all([
    getCompanyDashboardStats(companyId),
    listJobPostingsByCompany(companyId),
    getCompanyJobsByCategory(companyId),
    getCompanyApplicationsByDay(companyId),
  ]);

  const recentJobPostings = jobPostings.slice(0, 5);

  const cards = [
    { label: "Total de ofertas", value: stats.totalOfertas, icon: FilesIcon },
    { label: "Publicadas", value: stats.publicadas, icon: CheckCircle2Icon },
    { label: "En borrador", value: stats.borrador, icon: FileEditIcon },
    { label: "Pendientes de aprobación", value: stats.pendientes, icon: ClockIcon },
    { label: "Vacantes activas", value: stats.vacantesActivas, icon: TrendingUpIcon },
    { label: "Postulantes totales", value: stats.postulantesTotales, icon: UsersIcon },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí tienes un resumen de tu actividad de reclutamiento.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/empresa/ofertas" />} nativeButton={false}>
            Ver ofertas
          </Button>
          <Button render={<Link href="/empresa/ofertas/nueva" />} nativeButton={false}>
            Publicar nueva oferta
          </Button>
        </div>
      </div>

      {stats.pendientes > 0 && (
        <Alert>
          <ClockIcon />
          <AlertDescription>
            Tienes {stats.pendientes} oferta{stats.pendientes === 1 ? "" : "s"} pendiente
            {stats.pendientes === 1 ? "" : "s"} de aprobación. Un administrador las revisará antes de
            publicarlas.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<card.icon />}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Vacantes por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <JobsByCategoryChart data={jobsByCategory} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Postulaciones por día (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsByDayChart data={applicationsByDay} />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Actividad reciente</h2>
          <Link
            href="/empresa/ofertas"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todas
          </Link>
        </div>

        {recentJobPostings.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon />}
            title="Aún no has publicado ofertas"
            description="Cuando publiques una vacante, aparecerá aquí para que le des seguimiento."
            action={
              <Button render={<Link href="/empresa/ofertas/nueva" />} nativeButton={false}>
                Publicar mi primera oferta
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {recentJobPostings.map((job) => (
              <li key={job.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <Link
                    href={`/empresa/ofertas/${job.id}/editar`}
                    className="truncate text-sm font-medium text-foreground hover:text-primary"
                  >
                    {job.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {job.category?.name ?? "Sin categoría"} · {new Date(job.createdAt).toLocaleDateString("es")}
                  </p>
                </div>
                <Badge variant={JOB_STATUS_VARIANTS[job.status]} className="shrink-0">
                  {JOB_STATUS_LABELS[job.status]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
