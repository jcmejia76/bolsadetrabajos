import { listCandidatesForAdmin } from "@/services/admin/candidate-admin.service";
import { CandidatesTable } from "./candidates-table";

export default async function AdminCandidatosPage() {
  const candidates = await listCandidatesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Candidatos registrados</h2>
      <CandidatesTable candidates={candidates} />
    </div>
  );
}
