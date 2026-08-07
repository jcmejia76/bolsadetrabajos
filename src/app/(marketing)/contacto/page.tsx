import type { Metadata } from "next";
import { MailIcon, ClockIcon, MessageCircleIcon } from "lucide-react";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contacto | Bolsa de Trabajos",
  description: "Ponte en contacto con el equipo de Bolsa de Trabajos.",
};

export default async function ContactoPage() {
  const session = await auth();
  const initialName = session?.user?.name ?? "";
  const initialEmail = session?.user?.email ?? "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contáctanos
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          ¿Tienes una propuesta, una duda comercial o algo que contarnos? Escríbenos y te
          respondemos lo antes posible.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MailIcon className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Correo</p>
                <p className="text-sm text-muted-foreground">contacto@bolsatrabajos.com</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClockIcon className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Tiempo de respuesta</p>
                <p className="text-sm text-muted-foreground">1 a 2 días hábiles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircleIcon className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">¿Pregunta rápida o un problema técnico?</p>
                <p className="text-sm text-muted-foreground">
                  Usa el chat de soporte en la esquina de la pantalla — te responde al instante.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <ContactForm initialName={initialName} initialEmail={initialEmail} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
