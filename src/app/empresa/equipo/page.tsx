import type { Metadata } from "next";
import { requireCompanySession } from "@/lib/auth-utils";
import { listCompanyStaff } from "@/services/staff/staff.service";
import { StaffTable } from "./staff-table";
import { InviteStaffDialog } from "./invite-staff-dialog";

export const metadata: Metadata = {
  title: "Equipo | Bolsa de Trabajos",
};

export default async function EmpresaEquipoPage() {
  // Page-level auth only checks the session is a company account (per the
  // project's convention, requireCompanyPermission's throw-not-redirect
  // behavior is reserved for Server Actions) — the invite/suspend/remove
  // Server Actions below are what actually enforce EMPRESA_EQUIPO_* on
  // staff without owner-level access; the nav item is hidden for them too.
  const { companyId } = await requireCompanySession();
  const staff = await listCompanyStaff(companyId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Equipo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invita a otras personas de tu empresa a ayudarte a gestionar ofertas y postulaciones.
          </p>
        </div>
        <InviteStaffDialog />
      </div>
      <StaffTable staff={staff} />
    </div>
  );
}
