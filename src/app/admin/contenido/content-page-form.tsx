"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createContentPageAction, updateContentPageAction } from "./actions";
import { DeleteContentPageDialog } from "./delete-content-page-dialog";

interface ContentPageFormProps {
  mode: "create" | "edit";
  initial?: {
    id: string;
    title: string;
    slug: string;
    body: string;
    seoTitle: string;
    seoDescription: string;
  };
}

export function ContentPageForm({ mode, initial }: ContentPageFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result =
      mode === "create"
        ? await createContentPageAction({ title, slug, body, seoTitle, seoDescription })
        : await updateContentPageAction(initial!.id, { title, body, seoTitle, seoDescription });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    toast.success(mode === "create" ? "Página creada" : "Página actualizada");
    router.push("/admin/contenido");
    router.refresh();
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" required>
                  Título
                </Label>
                <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug" required>
                  Slug (URL)
                </Label>
                {mode === "create" ? (
                  <Input
                    id="slug"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="politica-de-privacidad"
                  />
                ) : (
                  <Input id="slug" value={`/${slug}`} disabled />
                )}
                {mode === "edit" && (
                  <p className="text-xs text-muted-foreground">
                    El slug no se puede cambiar una vez creada la página.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="body" required>
                Contenido (HTML)
              </Label>
              <Textarea
                id="body"
                required
                rows={16}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="font-mono text-xs"
                placeholder={"<h2>Título</h2>\n<p>Contenido...</p>"}
              />
              <p className="text-xs text-muted-foreground">
                Acepta HTML (h2, p, ul, li, a, strong, etc.). Se muestra tal cual en la página pública.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoTitle">Título SEO (opcional)</Label>
                <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoDescription">Descripción SEO (opcional)</Label>
                <Input
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : mode === "create" ? "Crear página" : "Guardar cambios"}
              </Button>
              {mode === "edit" && initial && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  Eliminar página
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {mode === "edit" && initial && (
        <DeleteContentPageDialog
          pageId={initial.id}
          pageTitle={initial.title}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => router.push("/admin/contenido")}
        />
      )}
    </>
  );
}
