import Link from "next/link";
import { BookmarkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JobCard } from "@/components/jobs/job-card";
import { mockJobs } from "@/lib/mock/jobs";

const SAVED_JOB_SLUGS = [
  "diseñador-a-de-producto-orbita-creativa",
  "analista-financiero-senior-vertice",
  "coordinador-a-de-logistica-logitrans",
];

export default function FavoritosPage() {
  const savedJobs = mockJobs.filter((job) => SAVED_JOB_SLUGS.includes(job.slug));

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
            <JobCard key={job.id} job={job} initialSaved />
          ))}
        </div>
      )}
    </div>
  );
}
