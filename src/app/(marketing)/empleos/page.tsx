import type { Metadata } from "next"

import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import { JobsListingClient } from "@/components/jobs/jobs-listing-client"
import {
  listPublishedJobPostings,
  listAllCategories,
} from "@/services/job-posting/job-posting-public.service"
import { listPublishedCompanies } from "@/services/company/company-public.service"
import { listFavoriteJobIds } from "@/services/favorite/favorite.service"
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
  const [session, jobPostings, categories, companies] = await Promise.all([
    auth(),
    listPublishedJobPostings(),
    listAllCategories(),
    listPublishedCompanies(),
  ])
  const favoritedIds =
    session?.user?.role === Role.CANDIDATO && session.user.candidateId
      ? await listFavoriteJobIds(session.user.candidateId)
      : undefined

  return (
    <JobsListingClient
      jobs={jobPostings.map((job) => mapJobPostingToCardData(job, favoritedIds))}
      categoryNames={categories.map((c) => c.name)}
      companyNames={companies.map((c) => c.name)}
      initialQuery={q ?? ""}
      initialLocation={location ?? ""}
      initialCategory={category ?? ""}
    />
  )
}
