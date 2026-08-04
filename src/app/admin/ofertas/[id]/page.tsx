import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";
import { getJobPostingForAdmin } from "@/services/admin/job-review.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JOB_STATUS_LABELS, JOB_STATUS_VARIANTS, MODALIDAD_LABELS, JORNADA_LABELS } from "@/lib/job-posting-labels";
import { JobDetailActions } from "./job-detail-actions";

export default async function AdminJobPostingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobPostingForAdmin(id);
  if (!job) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/ofertas"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Volver a ofertas
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{job.title}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={JOB_STATUS_VARIANTS[job.status]}>{JOB_STATUS_LABELS[job.status]}</Badge>
            <span>{job.company.name}</span>
            <span>{MODALIDAD_LABELS[job.modalidad]} · {JORNADA_LABELS[job.jornada]}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href={`/admin/ofertas/${job.id}/editar`} />} nativeButton={false}>
            Editar
          </Button>
          <JobDetailActions
            jobPostingId={job.id}
            jobTitle={job.title}
            status={job.status}
            isFeatured={job.isFeatured}
          />
        </div>
      </div>

      {job.rejectionReason && (
        <Alert>
          <InfoIcon />
          <AlertDescription>
            Motivo del último rechazo/solicitud de cambios: {job.rejectionReason}
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Descripción</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
          {job.description}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>Categoría: {job.category?.name ?? "—"}</p>
          <p>Ciudad: {job.city ?? "—"}</p>
          <p>País: {job.country ?? "—"}</p>
          <p>Plazas: {job.vacancies}</p>
          <p>Postulantes: {job._count.applications}</p>
          <p>Creada por: {job.createdBy.email}</p>
          <p>Aprobada por: {job.approvedBy?.email ?? "—"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
