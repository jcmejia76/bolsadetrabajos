import Link from "next/link";
import { cn } from "@/lib/utils";
import { listCompanies } from "@/services/company/company.service";
import { CompanyStatus } from "@/generated/prisma/enums";
import { CompaniesTable } from "./companies-table";

const STATUS_FILTERS: { label: string; value?: CompanyStatus }[] = [
  { label: "Pendientes", value: CompanyStatus.PENDIENTE },
  { label: "Todas" },
  { label: "Aprobadas", value: CompanyStatus.APROBADA },
  { label: "Rechazadas", value: CompanyStatus.RECHAZADA },
  { label: "Suspendidas", value: CompanyStatus.SUSPENDIDA },
];

export default async function AdminEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const hasStatusParam = status !== undefined;
  const activeStatus = Object.values(CompanyStatus).includes(status as CompanyStatus)
    ? (status as CompanyStatus)
    : hasStatusParam
      ? undefined
      : CompanyStatus.PENDIENTE;

  const companies = await listCompanies({ status: activeStatus });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Gestión de Empresas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aprueba, rechaza o administra las empresas registradas en la plataforma.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/empresas?status=${filter.value}` : "/admin/empresas?status=all"}
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

      <CompaniesTable companies={companies} />
    </div>
  );
}
