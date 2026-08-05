import { prisma } from "@/lib/prisma";
import { ApplicationStatus, JobStatus, NotificationType, Prisma } from "@/generated/prisma/client";
import { createNotification } from "@/services/notification/notification.service";

export async function createApplication(
  candidateId: string,
  jobPostingId: string,
  coverLetter?: string
) {
  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id: jobPostingId },
    include: { company: { select: { userId: true, name: true } } },
  });
  if (!jobPosting || jobPosting.status !== JobStatus.PUBLICADA) {
    throw new Error("Esta vacante ya no está disponible");
  }

  const cv = await prisma.cV.findFirst({
    where: { candidateId },
    orderBy: [{ isPrimary: "desc" }, { version: "desc" }],
  });
  if (!cv) {
    throw new Error("Necesitas subir o generar un CV antes de postularte");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          jobPostingId,
          candidateId,
          cvId: cv.id,
          coverLetter: coverLetter?.trim() || null,
        },
      });
      await createNotification(
        {
          userId: jobPosting.company.userId,
          type: NotificationType.NUEVA_POSTULACION,
          title: "Nueva postulación",
          message: `Tienes un nuevo postulante para "${jobPosting.title}".`,
        },
        tx
      );
      return application;
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new Error("Ya te has postulado a esta vacante");
    }
    throw e;
  }
}

export async function hasCandidateApplied(candidateId: string, jobPostingId: string) {
  const application = await prisma.application.findUnique({
    where: { jobPostingId_candidateId: { jobPostingId, candidateId } },
    select: { id: true },
  });
  return !!application;
}

export async function listApplicationsForJobPosting(companyId: string, jobPostingId: string) {
  const jobPosting = await prisma.jobPosting.findFirst({ where: { id: jobPostingId, companyId } });
  if (!jobPosting) throw new Error("Oferta no encontrada");

  return prisma.application.findMany({
    where: { jobPostingId },
    include: {
      candidate: true,
      cv: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: true } },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateApplicationStatus(
  companyId: string,
  applicationId: string,
  status: ApplicationStatus
) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, jobPosting: { companyId } },
  });
  if (!application) throw new Error("Postulación no encontrada");

  return prisma.application.update({
    where: { id: applicationId },
    data: { status, statusUpdatedAt: new Date() },
  });
}

export async function addApplicationNote(
  companyId: string,
  applicationId: string,
  authorId: string,
  note: string
) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, jobPosting: { companyId } },
  });
  if (!application) throw new Error("Postulación no encontrada");

  return prisma.applicationNote.create({
    data: { applicationId, authorId, note },
  });
}
