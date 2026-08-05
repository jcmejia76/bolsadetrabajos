import { prisma } from "@/lib/prisma";
import { CVStatus, NotificationType } from "@/generated/prisma/client";
import { createNotification } from "@/services/notification/notification.service";

export async function listCvsForAdmin(
  filters: { status?: CVStatus; search?: string } = {},
  page = 1,
  pageSize = 25
) {
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          candidate: {
            OR: [
              { firstName: { contains: filters.search, mode: "insensitive" as const } },
              { lastName: { contains: filters.search, mode: "insensitive" as const } },
            ],
          },
        }
      : {}),
  };
  const [cvs, total] = await Promise.all([
    prisma.cV.findMany({
      where,
      include: { candidate: { select: { firstName: true, lastName: true, userId: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.cV.count({ where }),
  ]);

  return { cvs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getCvForAdmin(cvId: string) {
  return prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      candidate: { include: { user: { select: { email: true } } } },
      reviewedBy: { select: { email: true } },
    },
  });
}

export async function approveCv(cvId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const cv = await tx.cV.update({
      where: { id: cvId },
      data: {
        status: CVStatus.APROBADO,
        reviewedById: adminId,
        reviewedAt: new Date(),
        reviewReason: null,
      },
      include: { candidate: true },
    });
    await createNotification(
      {
        userId: cv.candidate.userId,
        type: NotificationType.CV_APROBADO,
        title: "CV aprobado",
        message: `Tu CV "${cv.fileName}" ha sido aprobado.`,
      },
      tx
    );
    return cv;
  });
}

export async function rejectCv(cvId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const cv = await tx.cV.update({
      where: { id: cvId },
      data: { status: CVStatus.RECHAZADO, reviewedById: adminId, reviewedAt: new Date(), reviewReason: reason },
      include: { candidate: true },
    });
    await createNotification(
      {
        userId: cv.candidate.userId,
        type: NotificationType.CV_RECHAZADO,
        title: "CV rechazado",
        message: `Tu CV "${cv.fileName}" fue rechazado. Motivo: ${reason}`,
      },
      tx
    );
    return cv;
  });
}

export async function requestCvChanges(cvId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const cv = await tx.cV.update({
      where: { id: cvId },
      data: {
        status: CVStatus.CAMBIOS_SOLICITADOS,
        reviewedById: adminId,
        reviewedAt: new Date(),
        reviewReason: reason,
      },
      include: { candidate: true },
    });
    await createNotification(
      {
        userId: cv.candidate.userId,
        type: NotificationType.CV_CAMBIOS_SOLICITADOS,
        title: "Se solicitaron cambios en tu CV",
        message: `Tu CV "${cv.fileName}" necesita cambios. Motivo: ${reason}`,
      },
      tx
    );
    return cv;
  });
}
