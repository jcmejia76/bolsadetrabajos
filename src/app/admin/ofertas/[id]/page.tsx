import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobPostingForAdmin } from "@/services/admin/job-review.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle>Motivo del último rechazo/solicitud de cambios</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{job.rejectionReason}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
          {job.description}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
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
