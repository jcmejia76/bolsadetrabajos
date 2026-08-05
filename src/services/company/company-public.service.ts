import { prisma } from "@/lib/prisma";
import { CompanyStatus, JobStatus } from "@/generated/prisma/client";

export async function listPublishedCompanies(search?: string) {
  return prisma.company.findMany({
    where: {
      status: CompanyStatus.APROBADA,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: { _count: { select: { jobPostings: { where: { status: JobStatus.PUBLICADA } } } } },
    orderBy: { name: "asc" },
    take: 200,
  });
}

export async function getPublishedCompanyBySlug(slug: string) {
  return prisma.company.findFirst({
    where: { slug, status: CompanyStatus.APROBADA },
    include: {
      jobPostings: {
        where: { status: JobStatus.PUBLICADA },
        include: {
          company: { select: { name: true, slug: true, color: true, initials: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}

export type PublishedCompany = Awaited<ReturnType<typeof listPublishedCompanies>>[number];
export type PublishedCompanyDetail = NonNullable<Awaited<ReturnType<typeof getPublishedCompanyBySlug>>>;
