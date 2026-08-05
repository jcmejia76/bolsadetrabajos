"use client"

import { useMemo, useState } from "react"
import { SearchIcon, SearchXIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { CompanyCard } from "@/components/companies/company-card"
import type { CompanyCardData } from "@/lib/company-view-model"

interface CompaniesListingClientProps {
  companies: CompanyCardData[]
  initialQuery: string
  initialIndustry: string
}

function CompaniesListingClient({
  companies,
  initialQuery,
  initialIndustry,
}: CompaniesListingClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [industry, setIndustry] = useState(initialIndustry)

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))).sort(),
    [companies]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return companies.filter((company) => {
      const matchesQuery =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q)
      const matchesIndustry = !industry || company.industry === industry
      return matchesQuery && matchesIndustry
    })
  }, [companies, query, industry])

  function handleClear() {
    setQuery("")
    setIndustry("")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Explora empresas
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} empresa{filtered.length === 1 ? "" : "s"}{" "}
          {filtered.length === 1 ? "encontrada" : "encontradas"}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 sm:flex-row">
        <div className="relative flex flex-1 items-center gap-2 rounded-xl bg-muted/60 px-3">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre de la empresa o industria"
            className="h-11 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIndustry("")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            industry === ""
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          Todas
        </button>
        {industries.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setIndustry(item)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              industry === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchXIcon />}
          title="No encontramos empresas con esos filtros"
          description="Intenta con otro término de búsqueda o revisa todas las industrias disponibles."
          action={
            <Button variant="outline" onClick={handleClear}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <Stagger
          key={filtered.map((c) => c.slug).join("-")}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((company) => (
            <StaggerItem key={company.slug}>
              <CompanyCard company={company} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  )
}

export { CompaniesListingClient }
