import { prisma } from "@/lib/prisma";
import { getStorageService, validateFile, keyFromUrl } from "@/services/storage";
import { CVSourceType, CVStatus } from "@/generated/prisma/client";
import { getCandidateProfile } from "@/services/candidate/candidate.service";
import { renderCvPdf } from "@/services/cv/cv-pdf-document";

export async function listCvsByCandidate(candidateId: string) {
  return prisma.cV.findMany({
    where: { candidateId },
    orderBy: [{ isPrimary: "desc" }, { version: "desc" }],
  });
}

export async function getCvForCandidate(candidateId: string, cvId: string) {
  return prisma.cV.findFirst({ where: { id: cvId, candidateId } });
}

async function nextVersion(candidateId: string): Promise<{ version: number; isPrimary: boolean }> {
  const existing = await prisma.cV.aggregate({
    where: { candidateId },
    _max: { version: true },
    _count: { _all: true },
  });
  return {
    version: (existing._max.version ?? 0) + 1,
    isPrimary: existing._count._all === 0,
  };
}

export async function uploadCv(
  candidateId: string,
  file: { buffer: Buffer; originalName: string; mimeType: string }
) {
  validateFile({ mimeType: file.mimeType, sizeBytes: file.buffer.byteLength }, "cv");

  const storage = getStorageService();
  const result = await storage.upload({ ...file, folder: "cvs" });
  const { version, isPrimary } = await nextVersion(candidateId);

  return prisma.cV.create({
    data: {
      candidateId,
      fileName: file.originalName,
      fileUrl: result.url,
      fileType: file.mimeType,
      fileSizeBytes: result.sizeBytes,
      sourceType: CVSourceType.UPLOAD,
      status: CVStatus.PENDIENTE,
      version,
      isPrimary,
    },
  });
}

export async function generateCvFromProfile(candidateId: string) {
  const candidate = await getCandidateProfile(candidateId);
  const pdfBuffer = await renderCvPdf(candidate);

  validateFile({ mimeType: "application/pdf", sizeBytes: pdfBuffer.byteLength }, "cv");

  const storage = getStorageService();
  const fileName = `CV-${candidate.firstName}-${candidate.lastName}.pdf`;
  const result = await storage.upload({
    buffer: pdfBuffer,
    originalName: fileName,
    mimeType: "application/pdf",
    folder: "cvs",
  });
  const { version, isPrimary } = await nextVersion(candidateId);

  return prisma.cV.create({
    data: {
      candidateId,
      fileName,
      fileUrl: result.url,
      fileType: "application/pdf",
      fileSizeBytes: result.sizeBytes,
      sourceType: CVSourceType.BUILDER,
      status: CVStatus.PENDIENTE,
      version,
      isPrimary,
    },
  });
}

export async function setPrimaryCv(candidateId: string, cvId: string) {
  const cv = await prisma.cV.findFirst({ where: { id: cvId, candidateId } });
  if (!cv) throw new Error("CV no encontrado");

  await prisma.$transaction([
    prisma.cV.updateMany({ where: { candidateId }, data: { isPrimary: false } }),
    prisma.cV.update({ where: { id: cvId }, data: { isPrimary: true } }),
  ]);
}

export async function deleteCv(candidateId: string, cvId: string) {
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, candidateId },
    include: { _count: { select: { applications: true } } },
  });
  if (!cv) throw new Error("CV no encontrado");
  if (cv._count.applications > 0) {
    throw new Error("No se puede eliminar un CV usado en postulaciones");
  }

  await prisma.cV.delete({ where: { id: cvId } });
  await getStorageService()
    .delete(keyFromUrl(cv.fileUrl))
    .catch(() => undefined);

  if (cv.isPrimary) {
    const next = await prisma.cV.findFirst({
      where: { candidateId },
      orderBy: { version: "desc" },
    });
    if (next) {
      await prisma.cV.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  }
}
