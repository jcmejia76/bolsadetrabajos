import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getContentPageForAdmin } from "@/services/content/content-page.service";
import { ContentPageForm } from "../content-page-form";

export default async function EditContentPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getContentPageForAdmin(id);
  if (!page) notFound();

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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{page.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Público en{" "}
          <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
            /{page.slug}
          </a>
        </p>
      </div>

      <ContentPageForm
        mode="edit"
        initial={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          body: page.body,
          seoTitle: page.seoTitle ?? "",
          seoDescription: page.seoDescription ?? "",
        }}
      />
    </div>
  );
}
