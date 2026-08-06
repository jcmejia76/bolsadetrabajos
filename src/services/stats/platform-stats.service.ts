import { prisma } from "@/lib/prisma";
import { ApplicationStatus, CompanyStatus, JobStatus } from "@/generated/prisma/client";

export async function getPlatformStats() {
  const [companies, jobs, candidates, hires] = await Promise.all([
    prisma.company.count({ where: { status: CompanyStatus.APROBADA } }),
    prisma.jobPosting.count({ where: { status: JobStatus.PUBLICADA } }),
    prisma.candidate.count(),
    prisma.application.count({ where: { status: ApplicationStatus.CONTRATADO } }),
  ]);

  return { companies, jobs, candidates, hires };
}

export type PlatformStats = Awaited<ReturnType<typeof getPlatformStats>>;
