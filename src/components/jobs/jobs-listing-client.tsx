"use client"

import { useMemo, useState } from "react"
import { FilterIcon, MapPinIcon, SearchIcon, SearchXIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { mockJobs } from "@/lib/mock/jobs"

const PAGE_SIZE = 6

type SortOption = "recientes" | "salario-desc" | "salario-asc"

const SORT_LABELS: Record<SortOption, string> = {
  recientes: "Más recientes",
  "salario-desc": "Salario: mayor a menor",
  "salario-asc": "Salario: menor a mayor",
}

interface JobsListingClientProps {
  initialQuery: string
  initialLocation: string
  initialCategory: string
}

function JobsListingClient({
  initialQuery,
  initialLocation,
  initialCategory,
}: JobsListingClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [categories, setCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [modalities, setModalities] = useState<string[]>([])
  const [schedules, setSchedules] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>("recientes")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const loc = location.trim().toLowerCase()

    const result = mockJobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q))
      const matchesLocation =
        !loc || job.location.toLowerCase().includes(loc)
      const matchesCategory =
        categories.length === 0 || categories.includes(job.category)
      const matchesModality =
        modalities.length === 0 || modalities.includes(job.modality)
      const matchesSchedule =
        schedules.length === 0 || schedules.includes(job.schedule)

      return (
        matchesQuery &&
        matchesLocation &&
        matchesCategory &&
        matchesModality &&
        matchesSchedule
      )
    })

    return [...result].sort((a, b) => {
      if (sort === "salario-desc") return b.salaryMax - a.salaryMax
      if (sort === "salario-asc") return a.salaryMax - b.salaryMax
      return a.postedDaysAgo - b.postedDaysAgo
    })
  }, [query, location, categories, modalities, schedules, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function resetPage() {
    setPage(1)
  }

  function handleClearFilters() {
    setCategories([])
    setModalities([])
    setSchedules([])
    resetPage()
  }

  const filterProps = {
    categories,
    onCategoriesChange: (v: string[]) => {
      setCategories(v)
      resetPage()
    },
    modalities,
    onModalitiesChange: (v: string[]) => {
      setModalities(v)
      resetPage()
    },
    schedules,
    onSchedulesChange: (v: string[]) => {
      setSchedules(v)
      resetPage()
    },
    onClear: handleClearFilters,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Explora empleos
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} vacante{filtered.length === 1 ? "" : "s"}{" "}
          disponible{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 sm:flex-row">
        <div className="relative flex flex-1 items-center gap-2 rounded-xl bg-muted/60 px-3">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              resetPage()
            }}
            placeholder="Puesto, empresa o palabra clave"
            className="h-11 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="relative flex flex-1 items-center gap-2 rounded-xl bg-muted/60 px-3">
          <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              resetPage()
            }}
            placeholder="Ubicación"
            className="h-11 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <JobFilters {...filterProps} />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" className="gap-2 lg:hidden" />}
              >
                <FilterIcon className="size-4" />
                Filtros
                {categories.length + modalities.length + schedules.length > 0 && (
                  <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {categories.length + modalities.length + schedules.length}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <JobFilters {...filterProps} />
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Ordenar por
              </span>
              <Select
                value={sort}
                onValueChange={(value) => setSort(value as SortOption)}
              >
                <SelectTrigger className="w-52">
                  <SelectValue>
                    {(value: SortOption) => SORT_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              icon={<SearchXIcon />}
              title="No encontramos vacantes con esos filtros"
              description="Intenta ajustar la búsqueda o limpiar los filtros para ver más resultados."
              action={
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <Stagger
              key={paginated.map((job) => job.id).join("-")}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {paginated.map((job) => (
                <StaggerItem key={job.id}>
                  <JobCard job={job} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === currentPage}
                        className="cursor-pointer"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}

export { JobsListingClient }
