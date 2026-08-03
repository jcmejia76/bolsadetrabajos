import type { Metadata } from "next"

import { CompaniesListingClient } from "@/components/companies/companies-listing-client"

export const metadata: Metadata = {
  title: "Explora empresas | Bolsa de Trabajos",
}

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string }>
}) {
  const { q, industry } = await searchParams

  return (
    <CompaniesListingClient
      initialQuery={q ?? ""}
      initialIndustry={industry ?? ""}
    />
  )
}
