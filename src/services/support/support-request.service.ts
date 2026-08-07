import { prisma } from "@/lib/prisma";
import type { Prisma, SupportRequestStatus } from "@/generated/prisma/client";
import type { SupportRequestInput } from "@/validations/support.schema";

export async function createSupportRequest(input: SupportRequestInput, userId: string | null) {
  return prisma.supportRequest.create({
    data: {
      userId,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    },
  });
}

export interface SupportRequestAdminFilters {
  status?: SupportRequestStatus;
}

function buildWhere(filters: SupportRequestAdminFilters): Prisma.SupportRequestWhereInput {
  return {
    ...(filters.status ? { status: filters.status } : {}),
  };
}

export async function listSupportRequestsForAdmin(
  filters: SupportRequestAdminFilters = {},
  page = 1,
  pageSize = 25
) {
  const where = buildWhere(filters);
  const [requests, total] = await Promise.all([
    prisma.supportRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.supportRequest.count({ where }),
  ]);

  return { requests, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getSupportRequestForAdmin(id: string) {
  return prisma.supportRequest.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, role: true } },
      resolvedBy: { select: { email: true } },
    },
  });
}

export async function updateSupportRequestStatus(
  id: string,
  data: { status: SupportRequestStatus; adminNote?: string | null },
  resolvedById: string
) {
  const isResolvedLike = data.status === "RESUELTO" || data.status === "CERRADO";
  return prisma.supportRequest.update({
    where: { id },
    data: {
      status: data.status,
      adminNote: data.adminNote || undefined,
      resolvedById: isResolvedLike ? resolvedById : null,
      resolvedAt: isResolvedLike ? new Date() : null,
    },
  });
}

export async function countOpenSupportRequests() {
  return prisma.supportRequest.count({ where: { status: "ABIERTO" } });
}
