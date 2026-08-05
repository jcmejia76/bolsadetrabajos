import Link from "next/link";
import { BookmarkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { requireCandidateSession } from "@/lib/auth-utils";
import { listFavoritedJobPostings } from "@/services/job-posting/job-posting-public.service";
import { mapJobPostingToCardData } from "@/lib/job-view-model";

export default async function FavoritosPage() {
  const { candidateId } = await requireCandidateSession();
  const jobPostings = await listFavoritedJobPostings(candidateId);
  const favoritedIds = new Set(jobPostings.map((job) => job.id));
  const savedJobs = jobPostings.map((job) => mapJobPostingToCardData(job, favoritedIds));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Empleos guardados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Las vacantes que has marcado para revisar más tarde.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<BookmarkIcon />}
          title="Aún no has guardado ningún empleo"
          description="Usa el ícono de marcador en cualquier vacante para guardarla aquí."
          action={
            <Button render={<Link href="/empleos" />} nativeButton={false}>
              Explorar empleos
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
