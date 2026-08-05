import { prisma } from "@/lib/prisma";
import { getStorageService, validateFile, keyFromUrl } from "@/services/storage";
import { CVStatus } from "@/generated/prisma/client";
import type { CandidateProfileInput } from "@/validations/candidate.schema";

function emptyToNull(value: string | undefined | null): string | null {
  return value && value.trim() !== "" ? value : null;
}

export async function getCandidateProfile(candidateId: string) {
  return prisma.candidate.findUniqueOrThrow({
    where: { id: candidateId },
    include: {
      user: { select: { email: true } },
      workExperiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      certifications: { orderBy: { issuedAt: "desc" } },
      languages: true,
    },
  });
}

export async function updateCandidateProfile(candidateId: string, input: CandidateProfileInput) {
  return prisma.candidate.update({
    where: { id: candidateId },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: emptyToNull(input.phone),
      address: emptyToNull(input.address),
      birthDate: input.birthDate ?? null,
      gender: emptyToNull(input.gender),
      nationality: emptyToNull(input.nationality),
      aboutMe: emptyToNull(input.aboutMe),
      profession: emptyToNull(input.profession),
      availability: emptyToNull(input.availability),
      salaryAspiration: input.salaryAspiration ?? null,
      portfolioUrl: emptyToNull(input.portfolioUrl),
      isProfilePublic: input.isProfilePublic,
      skills: input.skills,
      socialLinks: input.socialLinks,
      references: input.references,
      workExperiences: { deleteMany: {}, create: input.workExperiences },
      educations: { deleteMany: {}, create: input.educations },
      certifications: { deleteMany: {}, create: input.certifications },
      languages: { deleteMany: {}, create: input.languages },
    },
  });
}

export async function updateCandidatePhoto(
  candidateId: string,
  file: { buffer: Buffer; originalName: string; mimeType: string }
) {
  validateFile(
    { mimeType: file.mimeType, sizeBytes: file.buffer.byteLength, buffer: file.buffer, originalName: file.originalName },
    "image",
    2
  );

  const existing = await prisma.candidate.findUniqueOrThrow({ where: { id: candidateId } });
  const storage = getStorageService();
  const result = await storage.upload({ ...file, folder: "avatars" });

  await prisma.candidate.update({ where: { id: candidateId }, data: { photoUrl: result.url } });

  if (existing.photoUrl) {
    await storage.delete(keyFromUrl(existing.photoUrl)).catch(() => undefined);
  }

  return result.url;
}

export async function removeCandidatePhoto(candidateId: string) {
  const existing = await prisma.candidate.findUniqueOrThrow({ where: { id: candidateId } });
  if (!existing.photoUrl) return;

  await prisma.candidate.update({ where: { id: candidateId }, data: { photoUrl: null } });
  await getStorageService()
    .delete(keyFromUrl(existing.photoUrl))
    .catch(() => undefined);
}

export async function getCandidateDashboardStats(candidateId: string) {
  const candidate = await prisma.candidate.findUniqueOrThrow({
    where: { id: candidateId },
    include: {
      workExperiences: { select: { id: true }, take: 1 },
      educations: { select: { id: true }, take: 1 },
      languages: { select: { id: true }, take: 1 },
    },
  });

  const checklist = [
    !!candidate.photoUrl,
    !!candidate.aboutMe,
    !!candidate.profession,
    candidate.workExperiences.length > 0,
    candidate.educations.length > 0,
    candidate.skills.length > 0,
    candidate.languages.length > 0,
  ];
  const completenessPct = Math.round(
    (checklist.filter(Boolean).length / checklist.length) * 100
  );

  const [cvCount, pendingCvCount, primaryCv] = await Promise.all([
    prisma.cV.count({ where: { candidateId } }),
    prisma.cV.count({ where: { candidateId, status: CVStatus.PENDIENTE } }),
    prisma.cV.findFirst({
      where: { candidateId, isPrimary: true },
      select: { fileName: true, status: true },
    }),
  ]);

  return { completenessPct, cvCount, pendingCvCount, primaryCv };
}
