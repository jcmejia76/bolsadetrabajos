import { MODALIDAD_LABELS, JORNADA_LABELS } from "@/lib/job-posting-labels";
import { JobModalidad } from "@/generated/prisma/enums";
import type { PublishedJobPosting, PublishedJobPostingDetail } from "@/services/job-posting/job-posting-public.service";

/**
 * Presentational shape consumed by JobCard/JobListItem/JobMapPopup/etc.
 * Deliberately kept field-for-field compatible with the legacy `MockJob`
 * shape (still used by `/candidato/favoritos`, which has no real
 * "favorites" model yet) so those components need no changes and a
 * `MockJob` value still satisfies this type structurally.
 */
export interface JobCardData {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  department?: string | null;
  lat?: number | null;
  lng?: number | null;
  remote: boolean;
  modality: string;
  schedule: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  category: string;
  categorySlug?: string;
  tags: string[];
  postedDaysAgo: number;
  featured: boolean;
  applicantsCount: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

function splitToBullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function daysSince(date: Date | null): number {
  if (!date) return 0;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

function locationLabel(job: { modalidad: JobModalidad; city: string | null; department: string | null; country: string | null }): string {
  if (job.modalidad === JobModalidad.REMOTO) return "Remoto";
  return job.city ?? job.department ?? job.country ?? "Guatemala";
}

function mapCore(job: PublishedJobPosting): JobCardData {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    companyName: job.company.name,
    companySlug: job.company.slug,
    companyInitials: job.company.initials ?? "?",
    companyColor: job.company.color ?? "oklch(0.56 0.17 258)",
    location: locationLabel(job),
    department: job.department,
    lat: job.lat,
    lng: job.lng,
    remote: job.modalidad === JobModalidad.REMOTO,
    modality: MODALIDAD_LABELS[job.modalidad] ?? job.modalidad,
    schedule: JORNADA_LABELS[job.jornada] ?? job.jornada,
    salaryMin: job.salaryVisible ? (job.salaryMin ? Number(job.salaryMin) : null) : null,
    salaryMax: job.salaryVisible ? (job.salaryMax ? Number(job.salaryMax) : null) : null,
    currency: "GTQ",
    category: job.category?.name ?? "Sin categoría",
    categorySlug: job.category?.slug,
    tags: job.keywords,
    postedDaysAgo: daysSince(job.publishedAt),
    featured: job.isFeatured,
    applicantsCount: job._count.applications,
    description: job.description,
    responsibilities: [],
    requirements: [],
    benefits: [],
  };
}

export function mapJobPostingToCardData(job: PublishedJobPosting): JobCardData {
  return mapCore(job);
}

export function mapJobPostingDetailToCardData(job: PublishedJobPostingDetail): JobCardData {
  return {
    ...mapCore(job),
    responsibilities: splitToBullets(job.responsibilities),
    requirements: splitToBullets(job.requirements),
    benefits: splitToBullets(job.benefits),
  };
}
