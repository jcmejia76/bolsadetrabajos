import { prisma } from "@/lib/prisma";
import type { ApplicationStatus, Prisma } from "@/generated/prisma/client";

export interface ApplicationAdminFilters {
  status?: ApplicationStatus;
  companyId?: string;
  candidateId?: string;
  jobPostingId?: string;
  from?: Date;
  to?: Date;
}

function buildWhere(filters: ApplicationAdminFilters): Prisma.ApplicationWhereInput {
  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.candidateId ? { candidateId: filters.candidateId } : {}),
    ...(filters.jobPostingId ? { jobPostingId: filters.jobPostingId } : {}),
    ...(filters.companyId ? { jobPosting: { companyId: filters.companyId } } : {}),
    ...(filters.from || filters.to
      ? {
          appliedAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {}),
  };
}

export async function listApplicationsForAdmin(
  filters: ApplicationAdminFilters = {},
  page = 1,
  pageSize = 25
) {
  const where = buildWhere(filters);
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        jobPosting: { select: { title: true, companyId: true, company: { select: { name: true } } } },
        candidate: { select: { firstName: true, lastName: true } },
        cv: { select: { fileName: true, fileUrl: true } },
      },
      orderBy: { appliedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.application.count({ where }),
  ]);

  return { applications, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getApplicationForAdmin(applicationId: string) {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      jobPosting: { include: { company: true } },
      candidate: { include: { user: { select: { email: true } } } },
      cv: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { email: true } } } },
    },
  });
}
