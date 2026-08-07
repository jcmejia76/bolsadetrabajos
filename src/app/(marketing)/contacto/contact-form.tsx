"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitSupportRequestAction } from "@/lib/actions/support-request";

interface ContactFormProps {
  initialName: string;
  initialEmail: string;
}

export function ContactForm({ initialName, initialEmail }: ContactFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitSupportRequestAction({ name, email, subject, message });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    toast.success("Mensaje enviado");
    setSent(true);
    setSubject("");
    setMessage("");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 px-6 py-10 text-center">
        <p className="text-base font-semibold text-foreground">¡Gracias por escribirnos!</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Recibimos tu mensaje y te responderemos a {email} lo antes posible.
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name" required>Nombre</Label>
          <Input
            id="contact-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email" required>Correo electrónico</Label>
          <Input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject" required>Asunto</Label>
        <Input
          id="contact-subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="¿Sobre qué quieres hablar con nosotros?"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message" required>Mensaje</Label>
        <Textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="sm:w-fit">
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
