import Link from "next/link";
import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireCandidateSession } from "@/lib/auth-utils";
import { listApplicationsByCandidate } from "@/services/application/application.service";
import { PostulacionesTable } from "./postulaciones-table";

export default async function PostulacionesPage() {
  const { candidateId } = await requireCandidateSession();
  const applications = await listApplicationsByCandidate(candidateId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis postulaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Da seguimiento al estado de cada empleo al que has aplicado.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<SendIcon />}
          title="Aún no has aplicado a ninguna vacante"
          description="Explora empleos disponibles y aplica en segundos."
          action={
            <Button render={<Link href="/empleos" />} nativeButton={false}>
              Buscar empleos
            </Button>
          }
        />
      ) : (
        <PostulacionesTable applications={applications} />
      )}
    </div>
  );
}
