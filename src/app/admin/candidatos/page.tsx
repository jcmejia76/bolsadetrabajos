import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listCandidatesForAdmin } from "@/services/admin/candidate-admin.service";
import { CandidatesTable } from "./candidates-table";

export default async function AdminCandidatosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { candidates, totalPages } = await listCandidatesForAdmin(undefined, currentPage);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Candidatos registrados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra las cuentas de candidatos de la plataforma.
        </p>
      </div>
      <CandidatesTable candidates={candidates} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {Math.max(1, totalPages)}
        </p>
        <div className="flex gap-2">
          {currentPage <= 1 ? (
            <Button variant="outline" disabled>
              Anterior
            </Button>
          ) : (
            <Button
              variant="outline"
              render={<Link href={`/admin/candidatos?page=${currentPage - 1}`} />}
              nativeButton={false}
            >
              Anterior
            </Button>
          )}
          {currentPage >= totalPages ? (
            <Button variant="outline" disabled>
              Siguiente
            </Button>
          ) : (
            <Button
              variant="outline"
              render={<Link href={`/admin/candidatos?page=${currentPage + 1}`} />}
              nativeButton={false}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
