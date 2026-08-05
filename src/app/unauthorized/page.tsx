import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Acceso no autorizado</h1>
      <p className="max-w-md text-muted-foreground">
        No tienes permiso para acceder a esta sección con tu cuenta actual.
      </p>
      <Button render={<Link href="/" />} variant="secondary" nativeButton={false}>
        Volver al inicio
      </Button>
    </main>
  );
}
