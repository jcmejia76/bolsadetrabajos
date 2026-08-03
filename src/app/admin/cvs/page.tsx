import Link from "next/link";
import { cn } from "@/lib/utils";
import { listCvsForAdmin } from "@/services/admin/cv-review.service";
import { CVStatus } from "@/generated/prisma/enums";
import { CvsAdminTable } from "./cvs-admin-table";

const STATUS_FILTERS: { label: string; value?: CVStatus }[] = [
  { label: "Pendientes", value: CVStatus.PENDIENTE },
  { label: "Todos" },
  { label: "Aprobados", value: CVStatus.APROBADO },
  { label: "Rechazados", value: CVStatus.RECHAZADO },
  { label: "Cambios solicitados", value: CVStatus.CAMBIOS_SOLICITADOS },
];

export default async function AdminCvsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const hasStatusParam = status !== undefined;
  const activeStatus = Object.values(CVStatus).includes(status as CVStatus)
    ? (status as CVStatus)
    : hasStatusParam
      ? undefined
      : CVStatus.PENDIENTE;

  const cvs = await listCvsForAdmin({ status: activeStatus });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Gestión de Currículums</h2>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/cvs?status=${filter.value}` : "/admin/cvs?status=all"}
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

      <CvsAdminTable cvs={cvs} />
    </div>
  );
}
