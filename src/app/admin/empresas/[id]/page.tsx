import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyById } from "@/services/company/company.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPANY_STATUS_LABELS, COMPANY_STATUS_VARIANTS } from "@/lib/company-labels";
import { JOB_STATUS_LABELS } from "@/lib/job-posting-labels";
import { EditCompanyForm } from "./edit-company-form";
import { CompanyDetailActions } from "./company-detail-actions";
import type { CompanyProfileInput } from "@/validations/company.schema";

export default async function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) notFound();

  const defaultValues: CompanyProfileInput = {
    name: company.name,
    description: company.description ?? "",
    industry: company.industry ?? "",
    size: company.size ?? "",
    website: company.website ?? "",
    email: company.email,
    phone: company.phone ?? "",
    address: company.address ?? "",
    city: company.city ?? "",
    country: company.country ?? "",
    contactName: company.contactName ?? "",
    contactEmail: company.contactEmail ?? "",
    contactPhone: company.contactPhone ?? "",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{company.name}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={COMPANY_STATUS_VARIANTS[company.status]}>
              {COMPANY_STATUS_LABELS[company.status]}
            </Badge>
            <span>{company.user.email}</span>
            {!company.user.isActive && <Badge variant="destructive">Usuario inactivo</Badge>}
          </div>
        </div>
        <CompanyDetailActions companyId={company.id} companyName={company.name} status={company.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de aprobación</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>Aprobado por: {company.approvedBy?.email ?? "—"}</p>
          <p>Fecha de aprobación: {company.approvedAt ? new Date(company.approvedAt).toLocaleString("es") : "—"}</p>
          {company.rejectionReason && <p>Motivo: {company.rejectionReason}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ofertas publicadas ({company.jobPostings.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {company.jobPostings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin ofertas todavía.</p>
          ) : (
            company.jobPostings.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <Link href={`/admin/ofertas/${job.id}`} className="underline underline-offset-4">
                  {job.title}
                </Link>
                <Badge variant="outline">{JOB_STATUS_LABELS[job.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <EditCompanyForm companyId={company.id} defaultValues={defaultValues} />
    </div>
  );
}
