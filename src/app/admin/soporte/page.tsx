import Link from "next/link";
import { LifeBuoyIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SupportRequestStatus } from "@/generated/prisma/enums";
import { SUPPORT_STATUS_LABELS, SUPPORT_STATUS_VARIANTS } from "@/lib/support-request-labels";
import { listSupportRequestsForAdmin } from "@/services/support/support-request.service";
import { SupportFilterBar } from "./support-filter-bar";

export default async function AdminSoportePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const activeStatus = Object.values(SupportRequestStatus).includes(status as SupportRequestStatus)
    ? (status as SupportRequestStatus)
    : undefined;
  const currentPage = Math.max(1, Number(page) || 1);

  const { requests, total, totalPages } = await listSupportRequestsForAdmin(
    { status: activeStatus },
    currentPage
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Soporte ({total})
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reportes técnicos y mensajes de contacto enviados por candidatos, empresas y visitantes.
        </p>
      </div>

      <SupportFilterBar />

      {requests.length === 0 ? (
        <EmptyState
          icon={<LifeBuoyIcon />}
          title="No hay reportes en este filtro"
          description="Prueba con otro estado o vuelve más tarde."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-3">Asunto</TableHead>
                  <TableHead className="px-4 py-3">Nombre</TableHead>
                  <TableHead className="px-4 py-3">Correo</TableHead>
                  <TableHead className="px-4 py-3">Estado</TableHead>
                  <TableHead className="px-4 py-3">Recibido el</TableHead>
                  <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="px-4 py-3 font-medium text-foreground">
                      {request.subject}
                    </TableCell>
                    <TableCell className="px-4 py-3">{request.name}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">{request.email}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={SUPPORT_STATUS_VARIANTS[request.status]}>
                        {SUPPORT_STATUS_LABELS[request.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString("es")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href={`/admin/soporte/${request.id}`} />}
                        nativeButton={false}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage <= 1 ? (
                <Button variant="outline" disabled>
                  Anterior
                </Button>
              ) : (
                <Button
                  variant="outline"
                  render={
                    <Link
                      href={`/admin/soporte?page=${currentPage - 1}${activeStatus ? `&status=${activeStatus}` : ""}`}
                    />
                  }
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
                  render={
                    <Link
                      href={`/admin/soporte?page=${currentPage + 1}${activeStatus ? `&status=${activeStatus}` : ""}`}
                    />
                  }
                  nativeButton={false}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
