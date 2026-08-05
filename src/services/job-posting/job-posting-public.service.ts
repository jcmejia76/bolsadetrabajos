import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/generated/prisma/client";

const PUBLIC_JOB_INCLUDE = {
  company: { select: { name: true, slug: true, color: true, initials: true } },
  category: { select: { name: true, slug: true } },
  _count: { select: { applications: true } },
} as const;

/**
 * All published jobs, unpaginated (capped) — the public listing filters and
 * sorts client-side over the full set, same pattern the page used with mock
 * data. Fine at today's volume; revisit with server-side filtering if the
 * catalog grows into the thousands.
 */
export async function listPublishedJobPostings() {
  return prisma.jobPosting.findMany({
    where: { status: JobStatus.PUBLICADA },
    include: PUBLIC_JOB_INCLUDE,
    orderBy: { publishedAt: "desc" },
    take: 500,
  });
}

export async function getPublishedJobPostingBySlug(slug: string) {
  return prisma.jobPosting.findFirst({
    where: { slug, status: JobStatus.PUBLICADA },
    include: {
      ...PUBLIC_JOB_INCLUDE,
      requiredLanguages: true,
    },
  });
}

export async function listSimilarPublishedJobPostings(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  return prisma.jobPosting.findMany({
    where: { status: JobStatus.PUBLICADA, categoryId, id: { not: excludeId } },
    include: PUBLIC_JOB_INCLUDE,
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export type PublishedJobPosting = Awaited<ReturnType<typeof listPublishedJobPostings>>[number];
export type PublishedJobPostingDetail = NonNullable<
  Awaited<ReturnType<typeof getPublishedJobPostingBySlug>>
>;

export async function listCategoriesWithJobCounts() {
  return prisma.jobCategory.findMany({
    include: { _count: { select: { jobPostings: { where: { status: JobStatus.PUBLICADA } } } } },
    orderBy: { name: "asc" },
  });
}

export async function listAllCategories() {
  return prisma.jobCategory.findMany({ orderBy: { name: "asc" } });
}
