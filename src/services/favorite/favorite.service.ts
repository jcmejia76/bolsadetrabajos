import { prisma } from "@/lib/prisma";

export async function listFavoriteJobIds(candidateId: string): Promise<Set<string>> {
  const favorites = await prisma.favorite.findMany({
    where: { candidateId },
    select: { jobPostingId: true },
  });
  return new Set(favorites.map((f) => f.jobPostingId));
}

export async function toggleFavorite(candidateId: string, jobPostingId: string): Promise<boolean> {
  const existing = await prisma.favorite.findUnique({
    where: { candidateId_jobPostingId: { candidateId, jobPostingId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.favorite.create({ data: { candidateId, jobPostingId } });
  return true;
}
