import { prisma } from "@/lib/prisma";

export async function listCandidatesForAdmin(search?: string) {
  return prisma.candidate.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      user: { select: { email: true, isActive: true } },
      _count: { select: { cvs: true, applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function suspendCandidate(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) throw new Error("Candidato no encontrado");
  await prisma.user.update({ where: { id: candidate.userId }, data: { isActive: false } });
}

export async function reactivateCandidate(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) throw new Error("Candidato no encontrado");
  await prisma.user.update({ where: { id: candidate.userId }, data: { isActive: true } });
}

export async function deleteCandidateProfile(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { _count: { select: { applications: true } } },
  });
  if (!candidate) throw new Error("Candidato no encontrado");
  if (candidate._count.applications > 0) {
    throw new Error(
      "No se puede eliminar un candidato con postulaciones registradas. Considera suspenderlo."
    );
  }
  await prisma.user.delete({ where: { id: candidate.userId } });
}
