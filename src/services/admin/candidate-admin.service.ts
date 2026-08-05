import { prisma } from "@/lib/prisma";

export async function listCandidatesForAdmin(search?: string, page = 1, pageSize = 25) {
  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      include: {
        user: { select: { email: true, isActive: true } },
        _count: { select: { cvs: true, applications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.candidate.count({ where }),
  ]);

  return { candidates, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
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
