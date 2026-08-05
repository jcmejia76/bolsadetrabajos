import type { Metadata } from "next"

import { CompaniesListingClient } from "@/components/companies/companies-listing-client"
import { listPublishedCompanies } from "@/services/company/company-public.service"
import { mapCompanyToCardData } from "@/lib/company-view-model"

export const metadata: Metadata = {
  title: "Explora empresas | Bolsa de Trabajos",
}

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string }>
}) {
  const { q, industry } = await searchParams
  const companies = await listPublishedCompanies()

  return (
    <CompaniesListingClient
      companies={companies.map(mapCompanyToCardData)}
      initialQuery={q ?? ""}
      initialIndustry={industry ?? ""}
    />
  )
}
