import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCompanySession } from "@/lib/auth-utils";
import { getJobPostingForCompany } from "@/services/job-posting/job-posting.service";
import { JobPostingForm } from "../../job-posting-form";
import type { JobPostingFormValues } from "@/validations/job-posting.schema";

export default async function EditarOfertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { companyId } = await requireCompanySession();

  const [jobPosting, categories] = await Promise.all([
    getJobPostingForCompany(companyId, id),
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
    salaryMin: jobPosting.salaryMin ? Number(jobPosting.salaryMin) : ("" as unknown as number),
    salaryMax: jobPosting.salaryMax ? Number(jobPosting.salaryMax) : ("" as unknown as number),
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

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-xl font-semibold">Editar oferta</h2>
      <JobPostingForm mode="edit" jobPostingId={id} categories={categories} defaultValues={defaultValues} />
    </div>
  );
}
