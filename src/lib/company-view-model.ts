import type { PublishedCompany, PublishedCompanyDetail } from "@/services/company/company-public.service";

/**
 * Presentational shape consumed by CompanyCard/etc. Field-for-field
 * compatible with the legacy `MockCompany` shape so components that render
 * it need no changes.
 */
export interface CompanyCardData {
  slug: string;
  name: string;
  initials: string;
  color: string;
  industry: string;
  location: string;
  jobCount: number;
  employeeRange: string;
  verified: boolean;
  description: string;
  longDescription?: string;
  foundedYear?: number;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  benefits?: string[];
}

export function mapCompanyToCardData(company: PublishedCompany): CompanyCardData {
  return {
    slug: company.slug,
    name: company.name,
    initials: company.initials ?? "?",
    color: company.color ?? "oklch(0.56 0.17 258)",
    industry: company.industry ?? "Sin especificar",
    location: company.city ?? company.country ?? "Ubicación no especificada",
    jobCount: company._count.jobPostings,
    employeeRange: company.size ?? "No especificado",
    verified: true,
    description: company.description ?? "",
    longDescription: company.description ?? "",
    website: company.website ?? undefined,
    email: company.email,
    phone: company.phone ?? undefined,
    address: company.address ?? undefined,
  };
}

export function mapCompanyDetailToCardData(company: PublishedCompanyDetail): CompanyCardData {
  return {
    slug: company.slug,
    name: company.name,
    initials: company.initials ?? "?",
    color: company.color ?? "oklch(0.56 0.17 258)",
    industry: company.industry ?? "Sin especificar",
    location: company.city ?? company.country ?? "Ubicación no especificada",
    jobCount: company.jobPostings.length,
    employeeRange: company.size ?? "No especificado",
    verified: true,
    description: company.description ?? "",
    longDescription: company.description ?? "",
    website: company.website ?? undefined,
    email: company.email,
    phone: company.phone ?? undefined,
    address: company.address ?? undefined,
  };
}
