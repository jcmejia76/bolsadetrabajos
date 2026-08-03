import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/client";

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
