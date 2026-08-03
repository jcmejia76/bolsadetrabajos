import { requireCandidateSession } from "@/lib/auth-utils";
import { listCvsByCandidate } from "@/services/cv/cv.service";
import { CvTable } from "./cv-table";
import { CvActionsBar } from "./cv-actions-bar";

export default async function CvPage() {
  const { candidateId } = await requireCandidateSession();
  const cvs = await listCvsByCandidate(candidateId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis CVs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sube tu currículum o genera uno automáticamente desde tu perfil.
          </p>
        </div>
        <CvActionsBar />
      </div>
      <CvTable cvs={cvs} />
    </div>
  );
}
