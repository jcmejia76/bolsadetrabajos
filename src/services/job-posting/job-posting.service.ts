import { prisma } from "@/lib/prisma";
import { generateSlugCandidate } from "@/lib/slug";
import { deriveJobCoordinates, getCurrencyForCountry } from "@/lib/geo";
import { fillDailySeries } from "@/lib/date-series";
import { JobStatus, Prisma } from "@/generated/prisma/client";
import type { JobPostingInput } from "@/validations/job-posting.schema";

function emptyToNull(value: string | undefined | null): string | null {
  return value && value.trim() !== "" ? value : null;
}

export function toJobPostingData(input: JobPostingInput) {
  const city = emptyToNull(input.city);
  const department = emptyToNull(input.department);
  const country = emptyToNull(input.country);
  const coordinates = deriveJobCoordinates(country, department, city);

  return {
    title: input.title,
    category: { connect: { id: input.categoryId } },
    professionalArea: emptyToNull(input.professionalArea),
    modalidad: input.modalidad,
    jornada: input.jornada,
    department,
    city,
    country,
    lat: coordinates?.lat ?? null,
    lng: coordinates?.lng ?? null,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    salaryVisible: input.salaryVisible,
    currency: getCurrencyForCountry(country),
    description: input.description,
    responsibilities: emptyToNull(input.responsibilities),
    requirements: emptyToNull(input.requirements),
    benefits: emptyToNull(input.benefits),
    vacancies: input.vacancies,
    deadline: input.deadline ?? null,
    experienceLevel: input.experienceLevel ?? null,
    academicLevel: input.academicLevel ?? null,
    requiresLicense: input.requiresLicense,
    requiresOwnVehicle: input.requiresOwnVehicle,
    travelAvailability: input.travelAvailability,
    keywords: input.keywords,
  };
}

const MAX_SLUG_ATTEMPTS = 3;

async function createWithUniqueSlug(
  title: string,
  buildData: (slug: string) => Prisma.JobPostingCreateInput
) {
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    try {
      return await prisma.jobPosting.create({ data: buildData(generateSlugCandidate(title)) });
    } catch (e) {
      const isSlugCollision =
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002" &&
        (e.meta?.target as string[] | undefined)?.includes("slug");
      if (isSlugCollision && attempt < MAX_SLUG_ATTEMPTS - 1) continue;
      throw e;
    }
  }
  throw new Error("No se pudo generar un slug único");
}

export async function listJobPostingsByCompany(companyId: string, status?: JobStatus) {
  return prisma.jobPosting.findMany({
    where: { companyId, ...(status ? { status } : {}) },
    include: { category: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobPostingForCompany(companyId: string, jobPostingId: string) {
  return prisma.jobPosting.findFirst({
    where: { id: jobPostingId, companyId },
    include: { requiredLanguages: true, category: true, _count: { select: { applications: true } } },
  });
}

export async function createJobPosting(
  companyId: string,
  createdById: string,
  input: JobPostingInput
) {
  const data = toJobPostingData(input);
  return createWithUniqueSlug(input.title, (slug) => ({
    ...data,
    slug,
    status: JobStatus.BORRADOR,
    company: { connect: { id: companyId } },
    createdBy: { connect: { id: createdById } },
    requiredLanguages: { create: input.requiredLanguages },
  }));
}

export async function updateJobPosting(
  companyId: string,
  jobPostingId: string,
  input: JobPostingInput
) {
  const existing = await prisma.jobPosting.findFirst({ where: { id: jobPostingId, companyId } });
  if (!existing) throw new Error("Oferta no encontrada");

  const data = toJobPostingData(input);
  return prisma.jobPosting.update({
    where: { id: jobPostingId },
    data: {
      ...data,
      requiredLanguages: {
        deleteMany: {},
        create: input.requiredLanguages,
      },
    },
  });
}

const RESUBMITTABLE_STATUSES: JobStatus[] = [
  JobStatus.BORRADOR,
  JobStatus.RECHAZADA,
  JobStatus.CAMBIOS_SOLICITADOS,
];

export async function submitJobPostingForReview(companyId: string, jobPostingId: string) {
  const existing = await prisma.jobPosting.findFirst({ where: { id: jobPostingId, companyId } });
  if (!existing) throw new Error("Oferta no encontrada");
  if (!RESUBMITTABLE_STATUSES.includes(existing.status)) {
    throw new Error(
      "Solo se puede enviar a revisión una oferta en borrador, rechazada o con cambios solicitados"
    );
  }
  return prisma.jobPosting.update({
    where: { id: jobPostingId },
    data: { status: JobStatus.PENDIENTE_APROBACION, rejectionReason: null },
  });
}

export async function duplicateJobPosting(
  companyId: string,
  jobPostingId: string,
  createdById: string
) {
  const existing = await prisma.jobPosting.findFirst({
    where: { id: jobPostingId, companyId },
    include: { requiredLanguages: true },
  });
  if (!existing) throw new Error("Oferta no encontrada");

  const title = `${existing.title} (copia)`;
  return createWithUniqueSlug(title, (slug) => ({
    title,
    professionalArea: existing.professionalArea,
    modalidad: existing.modalidad,
    jornada: existing.jornada,
    department: existing.department,
    city: existing.city,
    country: existing.country,
    lat: existing.lat,
    lng: existing.lng,
    salaryMin: existing.salaryMin,
    salaryMax: existing.salaryMax,
    salaryVisible: existing.salaryVisible,
    currency: existing.currency,
    description: existing.description,
    responsibilities: existing.responsibilities,
    requirements: existing.requirements,
    benefits: existing.benefits,
    vacancies: existing.vacancies,
    deadline: existing.deadline,
    experienceLevel: existing.experienceLevel,
    academicLevel: existing.academicLevel,
    requiresLicense: existing.requiresLicense,
    requiresOwnVehicle: existing.requiresOwnVehicle,
    travelAvailability: existing.travelAvailability,
    keywords: existing.keywords,
    slug,
    status: JobStatus.BORRADOR,
    company: { connect: { id: companyId } },
    createdBy: { connect: { id: createdById } },
    category: existing.categoryId ? { connect: { id: existing.categoryId } } : undefined,
    requiredLanguages: {
      create: existing.requiredLanguages.map((l) => ({ language: l.language, level: l.level })),
    },
  }));
}

export async function pauseJobPosting(companyId: string, jobPostingId: string) {
  const existing = await prisma.jobPosting.findFirst({ where: { id: jobPostingId, companyId } });
  if (!existing) throw new Error("Oferta no encontrada");
  if (existing.status !== JobStatus.PUBLICADA) {
    throw new Error("Solo se puede pausar una oferta publicada");
  }
  return prisma.jobPosting.update({
    where: { id: jobPostingId },
    data: { status: JobStatus.CERRADA, closedAt: new Date() },
  });
}

export async function resumeJobPosting(companyId: string, jobPostingId: string) {
  const existing = await prisma.jobPosting.findFirst({ where: { id: jobPostingId, companyId } });
  if (!existing) throw new Error("Oferta no encontrada");
  if (existing.status !== JobStatus.CERRADA) {
    throw new Error("Solo se puede reanudar una oferta pausada/cerrada");
  }
  if (existing.deadline && existing.deadline < new Date()) {
    throw new Error("La fecha límite ya pasó; actualízala antes de reanudar la oferta");
  }
  return prisma.jobPosting.update({
    where: { id: jobPostingId },
    data: { status: JobStatus.PUBLICADA, closedAt: null },
  });
}

export async function deleteJobPosting(companyId: string, jobPostingId: string) {
  const existing = await prisma.jobPosting.findFirst({
    where: { id: jobPostingId, companyId },
    include: { _count: { select: { applications: true } } },
  });
  if (!existing) throw new Error("Oferta no encontrada");
  if (existing._count.applications > 0) {
    throw new Error("No se puede eliminar una oferta con postulaciones recibidas");
  }
  await prisma.jobPosting.delete({ where: { id: jobPostingId } });
}

export async function getCompanyDashboardStats(companyId: string) {
  const [totalOfertas, statusGroups, publicadas, postulantesTotales] = await Promise.all([
    prisma.jobPosting.count({ where: { companyId } }),
    prisma.jobPosting.groupBy({ by: ["status"], where: { companyId }, _count: { _all: true } }),
    prisma.jobPosting.aggregate({
      where: { companyId, status: JobStatus.PUBLICADA },
      _sum: { vacancies: true },
      _count: { _all: true },
    }),
    prisma.application.count({ where: { jobPosting: { companyId } } }),
  ]);

  const countByStatus = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count._all])
  ) as Partial<Record<JobStatus, number>>;

  return {
    totalOfertas,
    publicadas: countByStatus[JobStatus.PUBLICADA] ?? 0,
    borrador: countByStatus[JobStatus.BORRADOR] ?? 0,
    pendientes: countByStatus[JobStatus.PENDIENTE_APROBACION] ?? 0,
    rechazadas: countByStatus[JobStatus.RECHAZADA] ?? 0,
    vacantesActivas: publicadas._sum.vacancies ?? 0,
    postulantesTotales,
  };
}

export async function getCompanyJobsByCategory(companyId: string) {
  const groups = await prisma.jobPosting.groupBy({
    by: ["categoryId"],
    where: { companyId, status: JobStatus.PUBLICADA },
    _count: { _all: true },
  });
  const categoryIds = groups.map((g) => g.categoryId).filter((id): id is string => id !== null);
  const categories = await prisma.jobCategory.findMany({ where: { id: { in: categoryIds } } });
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  return groups
    .map((g) => ({
      category: g.categoryId ? (nameById.get(g.categoryId) ?? "Sin categoría") : "Sin categoría",
      vacantes: g._count._all,
    }))
    .sort((a, b) => b.vacantes - a.vacantes);
}

export async function getCompanyApplicationsByDay(companyId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<{ day: Date; count: number }[]>`
    SELECT date_trunc('day', a."appliedAt") as day, COUNT(*)::int as count
    FROM "Application" a
    JOIN "JobPosting" jp ON jp.id = a."jobPostingId"
    WHERE jp."companyId" = ${companyId} AND a."appliedAt" >= ${since}
    GROUP BY day
    ORDER BY day
  `;

  return fillDailySeries(
    rows.map((r) => ({ date: r.day, count: r.count })),
    days
  );
}
