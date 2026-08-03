import { prisma } from "@/lib/prisma";
import { JobStatus, NotificationType } from "@/generated/prisma/client";
import { createNotification } from "@/services/notification/notification.service";
import { toJobPostingData } from "@/services/job-posting/job-posting.service";
import type { JobPostingInput } from "@/validations/job-posting.schema";

export async function listJobPostingsForAdmin(filters: { status?: JobStatus; search?: string } = {}) {
  return prisma.jobPosting.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search ? { title: { contains: filters.search, mode: "insensitive" } } : {}),
    },
    include: { company: true, category: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobPostingForAdmin(jobPostingId: string) {
  return prisma.jobPosting.findUnique({
    where: { id: jobPostingId },
    include: {
      company: true,
      category: true,
      requiredLanguages: true,
      createdBy: { select: { email: true } },
      approvedBy: { select: { email: true } },
      _count: { select: { applications: true } },
    },
  });
}

export async function approveJobPosting(jobPostingId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const job = await tx.jobPosting.update({
      where: { id: jobPostingId },
      data: {
        status: JobStatus.PUBLICADA,
        approvedById: adminId,
        publishedAt: new Date(),
        rejectionReason: null,
      },
      include: { company: true },
    });
    await createNotification(
      {
        userId: job.company.userId,
        type: NotificationType.OFERTA_APROBADA,
        title: "Oferta aprobada",
        message: `Tu oferta "${job.title}" ha sido aprobada y ya está publicada.`,
      },
      tx
    );
    return job;
  });
}

export async function rejectJobPosting(jobPostingId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const job = await tx.jobPosting.update({
      where: { id: jobPostingId },
      data: { status: JobStatus.RECHAZADA, approvedById: adminId, rejectionReason: reason },
      include: { company: true },
    });
    await createNotification(
      {
        userId: job.company.userId,
        type: NotificationType.OFERTA_RECHAZADA,
        title: "Oferta rechazada",
        message: `Tu oferta "${job.title}" fue rechazada. Motivo: ${reason}`,
      },
      tx
    );
    return job;
  });
}

export async function requestJobPostingChanges(jobPostingId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const job = await tx.jobPosting.update({
      where: { id: jobPostingId },
      data: { status: JobStatus.CAMBIOS_SOLICITADOS, approvedById: adminId, rejectionReason: reason },
      include: { company: true },
    });
    await createNotification(
      {
        userId: job.company.userId,
        type: NotificationType.OFERTA_CAMBIOS_SOLICITADOS,
        title: "Se solicitaron cambios en tu oferta",
        message: `Tu oferta "${job.title}" necesita cambios antes de publicarse. Motivo: ${reason}`,
      },
      tx
    );
    return job;
  });
}

export async function toggleJobPostingFeatured(jobPostingId: string, isFeatured: boolean) {
  return prisma.jobPosting.update({ where: { id: jobPostingId }, data: { isFeatured } });
}

export async function updateJobPostingAsAdmin(jobPostingId: string, input: JobPostingInput) {
  const existing = await prisma.jobPosting.findUnique({ where: { id: jobPostingId } });
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
