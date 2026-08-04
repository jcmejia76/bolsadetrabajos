import { listCandidatesForAdmin } from "@/services/admin/candidate-admin.service";
import { CandidatesTable } from "./candidates-table";

export default async function AdminCandidatosPage() {
  const candidates = await listCandidatesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Candidatos registrados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra las cuentas de candidatos de la plataforma.
        </p>
      </div>
      <CandidatesTable candidates={candidates} />
    </div>
  );
}
