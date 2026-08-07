import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ContentPageForm } from "../content-page-form";

export default function NuevaContentPagePage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/contenido"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Volver a contenido
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nueva página</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Se publicará de inmediato en la URL que definas.
        </p>
      </div>

      <ContentPageForm mode="create" />
    </div>
  );
}
