import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedContentPageBySlug } from "@/services/content/content-page.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedContentPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.seoTitle || `${page.title} | Bolsa de Trabajos`,
    description: page.seoDescription || undefined,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedContentPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {page.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Última actualización:{" "}
        {new Date(page.updatedAt).toLocaleDateString("es", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div
        className="mt-10 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2:first-child]:mt-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
