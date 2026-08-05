import type { Metadata } from "next"

import { JobsListingClient } from "@/components/jobs/jobs-listing-client"
import {
  listPublishedJobPostings,
  listAllCategories,
} from "@/services/job-posting/job-posting-public.service"
import { listPublishedCompanies } from "@/services/company/company-public.service"
import { mapJobPostingToCardData } from "@/lib/job-view-model"

export const metadata: Metadata = {
  title: "Explora empleos | Bolsa de Trabajos",
}

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; category?: string }>
}) {
  const { q, location, category } = await searchParams
  const [jobPostings, categories, companies] = await Promise.all([
    listPublishedJobPostings(),
    listAllCategories(),
    listPublishedCompanies(),
  ])

  return (
    <JobsListingClient
      jobs={jobPostings.map(mapJobPostingToCardData)}
      categoryNames={categories.map((c) => c.name)}
      companyNames={companies.map((c) => c.name)}
      initialQuery={q ?? ""}
      initialLocation={location ?? ""}
      initialCategory={category ?? ""}
    />
  )
}
