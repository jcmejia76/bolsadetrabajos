import Link from "next/link";
import { ScrollTextIcon, PlusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listContentPages } from "@/services/content/content-page.service";

export default async function AdminContenidoPage() {
  const pages = await listContentPages();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Contenido</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra páginas públicas como política de privacidad, cookies o términos y
            condiciones.
          </p>
        </div>
        <Button render={<Link href="/admin/contenido/nueva" />} nativeButton={false} className="gap-1.5 w-fit">
          <PlusIcon className="size-4" />
          Nueva página
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          icon={<ScrollTextIcon />}
          title="No hay páginas de contenido"
          description="Crea tu primera página, por ejemplo la política de privacidad."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-3">Título</TableHead>
                <TableHead className="px-4 py-3">URL</TableHead>
                <TableHead className="px-4 py-3">Actualizado</TableHead>
                <TableHead className="px-4 py-3 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="px-4 py-3 font-medium text-foreground">{page.title}</TableCell>
                  <TableCell className="px-4 py-3">
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      /{page.slug}
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {new Date(page.updatedAt).toLocaleDateString("es")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={`/admin/contenido/${page.id}`} />}
                      nativeButton={false}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
