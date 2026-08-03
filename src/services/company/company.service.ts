import { prisma } from "@/lib/prisma";
import { CompanyStatus, JobStatus, NotificationType } from "@/generated/prisma/client";
import { createNotification } from "@/services/notification/notification.service";
import type { CompanyProfileInput } from "@/validations/company.schema";

function emptyToNull(value: string | undefined | null): string | null {
  return value && value.trim() !== "" ? value : null;
}

export async function listCompanies(filters: { status?: CompanyStatus; search?: string } = {}) {
  return prisma.company.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? { name: { contains: filters.search, mode: "insensitive" } }
        : {}),
    },
    include: { _count: { select: { jobPostings: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompanyById(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: { select: { email: true, isActive: true } },
      approvedBy: { select: { email: true } },
      jobPostings: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function approveCompany(companyId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { id: companyId },
      data: {
        status: CompanyStatus.APROBADA,
        approvedById: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });
    await createNotification(
      {
        userId: company.userId,
        type: NotificationType.EMPRESA_APROBADA,
        title: "Empresa aprobada",
        message: `Tu empresa "${company.name}" ha sido aprobada. Ya puedes publicar ofertas.`,
      },
      tx
    );
    return company;
  });
}

export async function rejectCompany(companyId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { id: companyId },
      data: {
        status: CompanyStatus.RECHAZADA,
        approvedById: adminId,
        rejectionReason: reason,
      },
    });
    await createNotification(
      {
        userId: company.userId,
        type: NotificationType.EMPRESA_RECHAZADA,
        title: "Empresa rechazada",
        message: `Tu empresa "${company.name}" fue rechazada. Motivo: ${reason}`,
      },
      tx
    );
    return company;
  });
}

export async function suspendCompany(companyId: string, adminId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.SUSPENDIDA, approvedById: adminId, rejectionReason: reason },
    });
    await tx.user.update({ where: { id: company.userId }, data: { isActive: false } });
    await tx.jobPosting.updateMany({
      where: { companyId, status: JobStatus.PUBLICADA },
      data: { status: JobStatus.CERRADA, closedAt: new Date() },
    });
    await createNotification(
      {
        userId: company.userId,
        type: NotificationType.EMPRESA_SUSPENDIDA,
        title: "Empresa suspendida",
        message: `Tu empresa "${company.name}" ha sido suspendida. Motivo: ${reason}`,
      },
      tx
    );
    return company;
  });
}

export async function reactivateCompany(companyId: string, adminId: string) {
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { id: companyId },
      data: { status: CompanyStatus.APROBADA, approvedById: adminId, approvedAt: new Date() },
    });
    await tx.user.update({ where: { id: company.userId }, data: { isActive: true } });
    return company;
  });
}

export async function updateCompany(companyId: string, input: CompanyProfileInput) {
  return prisma.company.update({
    where: { id: companyId },
    data: {
      name: input.name,
      description: emptyToNull(input.description),
      industry: emptyToNull(input.industry),
      size: emptyToNull(input.size),
      website: emptyToNull(input.website),
      email: input.email,
      phone: emptyToNull(input.phone),
      address: emptyToNull(input.address),
      city: emptyToNull(input.city),
      country: emptyToNull(input.country),
      contactName: emptyToNull(input.contactName),
      contactEmail: emptyToNull(input.contactEmail),
      contactPhone: emptyToNull(input.contactPhone),
    },
  });
}

export async function deleteCompany(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { jobPostings: { include: { _count: { select: { applications: true } } } } },
  });
  if (!company) throw new Error("Empresa no encontrada");

  const hasApplications = company.jobPostings.some((job) => job._count.applications > 0);
  if (hasApplications) {
    throw new Error(
      "No se puede eliminar una empresa con postulaciones recibidas en sus ofertas. Considera suspenderla."
    );
  }

  await prisma.user.delete({ where: { id: company.userId } });
}
