import { prisma } from "@/lib/prisma";
import { JobPostingForm } from "../job-posting-form";

export default async function NuevaOfertaPage() {
  const categories = await prisma.jobCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-xl font-semibold">Publicar nueva oferta</h2>
      <JobPostingForm mode="create" categories={categories} />
    </div>
  );
}
