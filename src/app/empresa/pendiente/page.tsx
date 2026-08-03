import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyStatus } from "@/generated/prisma/enums";

export default async function EmpresaPendientePage() {
  const session = await auth();
  const company = session?.user.companyId
    ? await prisma.company.findUnique({ where: { id: session.user.companyId } })
    : null;

  const status = company?.status;

  let title = "Cuenta en revisión";
  let message = "Tu empresa aún no ha sido aprobada por un administrador. Te notificaremos cuando el proceso finalice.";

  if (status === CompanyStatus.RECHAZADA) {
    title = "Empresa rechazada";
    message = company?.rejectionReason
      ? `Tu empresa fue rechazada. Motivo: ${company.rejectionReason}`
      : "Tu empresa fue rechazada por un administrador.";
  } else if (status === CompanyStatus.SUSPENDIDA) {
    title = "Empresa suspendida";
    message = company?.rejectionReason
      ? `Tu empresa ha sido suspendida. Motivo: ${company.rejectionReason}`
      : "Tu empresa ha sido suspendida por un administrador.";
  }

  return (
    <div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">{message}</CardContent>
      </Card>
    </div>
  );
}
