import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getSupportRequestForAdmin } from "@/services/support/support-request.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUPPORT_STATUS_LABELS, SUPPORT_STATUS_VARIANTS } from "@/lib/support-request-labels";
import { SupportDetailActions } from "./support-detail-actions";

export default async function AdminSupportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getSupportRequestForAdmin(id);
  if (!request) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/soporte"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Volver a soporte
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{request.subject}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant={SUPPORT_STATUS_VARIANTS[request.status]}>
            {SUPPORT_STATUS_LABELS[request.status]}
          </Badge>
          <span>
            {request.name} · {request.email}
          </span>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Mensaje</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
          {request.message}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>Cuenta asociada: {request.user?.email ?? "Visitante (sin cuenta)"}</p>
          <p>Recibido: {new Date(request.createdAt).toLocaleString("es")}</p>
          <p>Resuelto por: {request.resolvedBy?.email ?? "—"}</p>
        </CardContent>
      </Card>

      <SupportDetailActions
        requestId={request.id}
        status={request.status}
        initialAdminNote={request.adminNote ?? ""}
      />
    </div>
  );
}
