import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getJobPostingForAdmin } from "@/services/admin/job-review.service";
import { JobPostingForm } from "@/app/empresa/ofertas/job-posting-form";
import type { JobPostingFormValues } from "@/validations/job-posting.schema";
import { updateJobPostingAsAdminAction } from "../../actions";

export default async function AdminEditarOfertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [jobPosting, categories] = await Promise.all([
    getJobPostingForAdmin(id),
    prisma.jobCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!jobPosting) notFound();

  const defaultValues: Partial<JobPostingFormValues> = {
    title: jobPosting.title,
    categoryId: jobPosting.categoryId ?? "",
    professionalArea: jobPosting.professionalArea ?? "",
    modalidad: jobPosting.modalidad,
    jornada: jobPosting.jornada,
    department: jobPosting.department ?? "",
    city: jobPosting.city ?? "",
    country: jobPosting.country ?? "",
    salaryMin: jobPosting.salaryMin ? Number(jobPosting.salaryMin) : null,
    salaryMax: jobPosting.salaryMax ? Number(jobPosting.salaryMax) : null,
    salaryVisible: jobPosting.salaryVisible,
    description: jobPosting.description,
    responsibilities: jobPosting.responsibilities ?? "",
    requirements: jobPosting.requirements ?? "",
    benefits: jobPosting.benefits ?? "",
    vacancies: jobPosting.vacancies,
    deadline: jobPosting.deadline,
    experienceLevel: jobPosting.experienceLevel,
    academicLevel: jobPosting.academicLevel,
    requiresLicense: jobPosting.requiresLicense,
    requiresOwnVehicle: jobPosting.requiresOwnVehicle,
    travelAvailability: jobPosting.travelAvailability,
    keywords: jobPosting.keywords,
    requiredLanguages: jobPosting.requiredLanguages.map((l) => ({
      language: l.language,
      level: l.level,
    })),
  };

  const submitAsAdmin = updateJobPostingAsAdminAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-xl font-semibold">Editar oferta (admin)</h2>
      <JobPostingForm
        mode="edit"
        jobPostingId={id}
        categories={categories}
        defaultValues={defaultValues}
        onSubmit={submitAsAdmin}
        redirectTo={`/admin/ofertas/${id}`}
      />
    </div>
  );
}
