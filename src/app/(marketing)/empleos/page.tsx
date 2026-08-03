import type { Metadata } from "next"

import { JobsListingClient } from "@/components/jobs/jobs-listing-client"

export const metadata: Metadata = {
  title: "Explora empleos | Bolsa de Trabajos",
}

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; category?: string }>
}) {
  const { q, location, category } = await searchParams

  return (
    <JobsListingClient
      initialQuery={q ?? ""}
      initialLocation={location ?? ""}
      initialCategory={category ?? ""}
    />
  )
}
