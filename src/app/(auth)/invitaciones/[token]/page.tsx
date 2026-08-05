import Link from "next/link";
import { BriefcaseBusinessIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvitationByToken } from "@/services/staff/staff.service";
import { AcceptInvitationForm } from "./accept-invitation-form";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  return (
    <main id="main-content" className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-grid-fade p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />
      <Link href="/" className="relative z-10 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BriefcaseBusinessIcon className="size-4.5" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Bolsa de Trabajos
        </span>
      </Link>
      <div className="relative z-10">
        <Card className="w-full max-w-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              {invitation ? "Únete al equipo" : "Invitación no disponible"}
            </CardTitle>
            <CardDescription>
              {invitation
                ? `${invitation.user.email} · ${invitation.role.name}`
                : "Este link de invitación ya no es válido o expiró. Pide a quien te invitó que genere uno nuevo."}
            </CardDescription>
          </CardHeader>
          {invitation && (
            <CardContent>
              <AcceptInvitationForm token={token} companyName={invitation.company?.name ?? "la empresa"} />
            </CardContent>
          )}
        </Card>
      </div>
    </main>
  );
}
