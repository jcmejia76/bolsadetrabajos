import { prisma } from "@/lib/prisma";
import { CompanyStatus, JobStatus, CVStatus, ApplicationStatus, Role } from "@/generated/prisma/client";
import { fillDailySeries, fillMonthlySeries } from "@/lib/date-series";

export async function getAdminDashboardCards() {
  const [
    empresasRegistradas,
    empresasPendientes,
    candidatosRegistrados,
    cvsPendientes,
    ofertasActivas,
    ofertasPendientes,
    ofertasRechazadas,
    postulaciones,
    nuevosUsuarios,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { status: CompanyStatus.PENDIENTE } }),
    prisma.candidate.count(),
    prisma.cV.count({ where: { status: CVStatus.PENDIENTE } }),
    prisma.jobPosting.count({ where: { status: JobStatus.PUBLICADA } }),
    prisma.jobPosting.count({ where: { status: JobStatus.PENDIENTE_APROBACION } }),
    prisma.jobPosting.count({ where: { status: JobStatus.RECHAZADA } }),
    prisma.application.count(),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
  ]);

  return {
    empresasRegistradas,
    empresasPendientes,
    candidatosRegistrados,
    cvsPendientes,
    ofertasActivas,
    ofertasPendientes,
    ofertasRechazadas,
    postulaciones,
    nuevosUsuarios,
  };
}

export async function getVacantesPorCategoria() {
  const groups = await prisma.jobPosting.groupBy({
    by: ["categoryId"],
    where: { status: JobStatus.PUBLICADA },
    _count: { _all: true },
  });
  const categoryIds = groups.map((g) => g.categoryId).filter((id): id is string => id !== null);
  const categories = await prisma.jobCategory.findMany({ where: { id: { in: categoryIds } } });
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  return groups
    .map((g) => ({
      category: g.categoryId ? (nameById.get(g.categoryId) ?? "Sin categoría") : "Sin categoría",
      vacantes: g._count._all,
    }))
    .sort((a, b) => b.vacantes - a.vacantes);
}

export async function getEmpresasMasActivas(limit = 10) {
  const groups = await prisma.jobPosting.groupBy({
    by: ["companyId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });
  const companies = await prisma.company.findMany({
    where: { id: { in: groups.map((g) => g.companyId) } },
  });
  const nameById = new Map(companies.map((c) => [c.id, c.name]));

  return groups.map((g) => ({
    empresa: nameById.get(g.companyId) ?? "—",
    ofertas: g._count.id,
  }));
}

export async function getPostulacionesPorDia(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<{ day: Date; count: number }[]>`
    SELECT date_trunc('day', "appliedAt") as day, COUNT(*)::int as count
    FROM "Application"
    WHERE "appliedAt" >= ${since}
    GROUP BY day
    ORDER BY day
  `;

  return fillDailySeries(
    rows.map((r) => ({ date: r.day, count: r.count })),
    days
  );
}

export async function getNuevosRegistros(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<{ day: Date; role: string; count: number }[]>`
    SELECT date_trunc('day', "createdAt") as day, "role", COUNT(*)::int as count
    FROM "User"
    WHERE "createdAt" >= ${since} AND "role" IN (${Role.CANDIDATO}, ${Role.EMPRESA})
    GROUP BY day, "role"
    ORDER BY day
  `;

  const candidatos = fillDailySeries(
    rows.filter((r) => r.role === Role.CANDIDATO).map((r) => ({ date: r.day, count: r.count })),
    days
  );
  const empresas = fillDailySeries(
    rows.filter((r) => r.role === Role.EMPRESA).map((r) => ({ date: r.day, count: r.count })),
    days
  );

  return candidatos.map((c, i) => ({
    date: c.date,
    candidatos: c.count,
    empresas: empresas[i]?.count ?? 0,
  }));
}

export async function getContrataciones(months = 6) {
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<{ month: Date; count: number }[]>`
    SELECT date_trunc('month', COALESCE("statusUpdatedAt", "updatedAt")) as month, COUNT(*)::int as count
    FROM "Application"
    WHERE "status" = ${ApplicationStatus.CONTRATADO}
      AND COALESCE("statusUpdatedAt", "updatedAt") >= ${since}
    GROUP BY month
    ORDER BY month
  `;

  return fillMonthlySeries(
    rows.map((r) => ({ month: r.month, count: r.count })),
    months
  );
}
