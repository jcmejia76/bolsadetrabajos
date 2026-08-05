"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { LatLngBounds } from "leaflet"
import { FilterIcon, MapPinIcon, SearchIcon, SearchXIcon } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Tabs, TabsList, TabsTab, TabsIndicator } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { JobListItem } from "@/components/jobs/job-list-item"
import { JobFilters, SALARY_BUCKETS, DATE_BUCKETS } from "@/components/jobs/job-filters"
import { JobMapPanel } from "@/components/jobs/job-map/job-map-panel"
import type { JobCardData } from "@/lib/job-view-model"
import { haversineDistanceKm } from "@/lib/geo"

const PAGE_SIZE = 10

type SortOption = "recientes" | "salario-desc" | "salario-asc" | "distancia"

const SORT_LABELS: Record<SortOption, string> = {
  recientes: "Más recientes",
  "salario-desc": "Salario: mayor a menor",
  "salario-asc": "Salario: menor a mayor",
  distancia: "Más cercanas",
}

interface JobsListingClientProps {
  jobs: JobCardData[]
  categoryNames: string[]
  companyNames: string[]
  initialQuery: string
  initialLocation: string
  initialCategory: string
}

function JobsListingClient({
  jobs,
  categoryNames,
  companyNames,
  initialQuery,
  initialLocation,
  initialCategory,
}: JobsListingClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [modalities, setModalities] = useState<string[]>([])
  const [schedules, setSchedules] = useState<string[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [salaryBuckets, setSalaryBuckets] = useState<string[]>([])
  const [datePosted, setDatePosted] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>("recientes")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<"lista" | "mapa">("lista")

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const [areaBounds, setAreaBounds] = useState<LatLngBounds | null>(null)

  const listScrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    const loc = location.trim().toLowerCase()

    const result = jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q))
      const matchesLocation = !loc || job.location.toLowerCase().includes(loc)
      const matchesCategory = categories.length === 0 || categories.includes(job.category)
      const matchesModality = modalities.length === 0 || modalities.includes(job.modality)
      const matchesSchedule = schedules.length === 0 || schedules.includes(job.schedule)
      const matchesDepartment =
        departments.length === 0 || (!!job.department && departments.includes(job.department))
      const matchesCompany = companies.length === 0 || companies.includes(job.companyName)
      const matchesSalary =
        salaryBuckets.length === 0 ||
        (job.salaryMin != null &&
          job.salaryMax != null &&
          salaryBuckets.some((label) => {
            const bucket = SALARY_BUCKETS.find((b) => b.label === label)
            return !!bucket && job.salaryMax! >= bucket.min && job.salaryMin! <= bucket.max
          }))
      const matchesDate =
        datePosted.length === 0 ||
        datePosted.some((label) => {
          const bucket = DATE_BUCKETS.find((b) => b.label === label)
          return !!bucket && job.postedDaysAgo <= bucket.maxDays
        })
      const matchesArea =
        !areaBounds || (job.lat != null && job.lng != null && areaBounds.contains([job.lat, job.lng]))

      return (
        matchesQuery &&
        matchesLocation &&
        matchesCategory &&
        matchesModality &&
        matchesSchedule &&
        matchesDepartment &&
        matchesCompany &&
        matchesSalary &&
        matchesDate &&
        matchesArea
      )
    })

    const distanceOf = (job: JobCardData) =>
      userLocation && job.lat != null && job.lng != null
        ? haversineDistanceKm(userLocation, { lat: job.lat, lng: job.lng })
        : Infinity

    return [...result].sort((a, b) => {
      if (sort === "salario-desc") return (b.salaryMax ?? 0) - (a.salaryMax ?? 0)
      if (sort === "salario-asc") return (a.salaryMax ?? 0) - (b.salaryMax ?? 0)
      if (sort === "distancia") return distanceOf(a) - distanceOf(b)
      return a.postedDaysAgo - b.postedDaysAgo
    })
  }, [
    jobs,
    query,
    location,
    categories,
    modalities,
    schedules,
    departments,
    companies,
    salaryBuckets,
    datePosted,
    areaBounds,
    sort,
    userLocation,
  ])

  // Computed once per relevant change instead of per-row-per-render (JobListItem is memoized).
  const distanceById = useMemo(() => {
    const map = new Map<string, number>()
    if (!userLocation) return map
    for (const job of filteredJobs) {
      if (job.lat != null && job.lng != null) {
        map.set(job.id, haversineDistanceKm(userLocation, { lat: job.lat, lng: job.lng }))
      }
    }
    return map
  }, [filteredJobs, userLocation])

  const visibleJobs = filteredJobs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredJobs.length

  const activeFilterCount =
    categories.length +
    modalities.length +
    schedules.length +
    departments.length +
    companies.length +
    salaryBuckets.length +
    datePosted.length

  function resetPaging() {
    setVisibleCount(PAGE_SIZE)
  }

  function handleClearFilters() {
    setCategories([])
    setModalities([])
    setSchedules([])
    setDepartments([])
    setCompanies([])
    setSalaryBuckets([])
    setDatePosted([])
    resetPaging()
  }

  const filterProps = {
    categories,
    onCategoriesChange: (v: string[]) => {
      setCategories(v)
      resetPaging()
    },
    modalities,
    onModalitiesChange: (v: string[]) => {
      setModalities(v)
      resetPaging()
    },
    schedules,
    onSchedulesChange: (v: string[]) => {
      setSchedules(v)
      resetPaging()
    },
    departments,
    onDepartmentsChange: (v: string[]) => {
      setDepartments(v)
      resetPaging()
    },
    companies,
    onCompaniesChange: (v: string[]) => {
      setCompanies(v)
      resetPaging()
    },
    salaryBuckets,
    onSalaryBucketsChange: (v: string[]) => {
      setSalaryBuckets(v)
      resetPaging()
    },
    datePosted,
    onDatePostedChange: (v: string[]) => {
      setDatePosted(v)
      resetPaging()
    },
    onClear: handleClearFilters,
  }

  // Infinite scroll: load more items as the sentinel enters the scroll container.
  useEffect(() => {
    const root = listScrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredJobs.length))
        }
      },
      { root, rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [filteredJobs.length])

  // Keep the corresponding list card in view when a marker is selected on the map.
  useEffect(() => {
    if (!selectedJobId) return
    document
      .getElementById(`job-item-${selectedJobId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [selectedJobId])

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no soporta geolocalización.")
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setGeoLoading(false)
      },
      () => {
        setGeoError("No pudimos acceder a tu ubicación.")
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const handleSearchThisArea = useCallback((bounds: LatLngBounds) => {
    setAreaBounds(bounds)
    resetPaging()
  }, [])

  const handleClearAreaSearch = useCallback(() => {
    setAreaBounds(null)
    resetPaging()
  }, [])

  return (
    <div className="flex h-[calc(100dvh-82px)] flex-col">
      <div className="border-b border-border md:hidden">
        <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as "lista" | "mapa")}>
          <TabsList className="w-full rounded-none bg-transparent p-2">
            <TabsTab value="lista">Lista</TabsTab>
            <TabsTab value="mapa">Mapa</TabsTab>
            <TabsIndicator />
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col md:flex-none md:w-[45%] md:border-r md:border-border lg:w-[42%]",
            mobileView !== "lista" && "hidden md:flex"
          )}
        >
          <div className="flex flex-col gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Explora empleos
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredJobs.length} vacante{filteredJobs.length === 1 ? "" : "s"} disponible
                {filteredJobs.length === 1 ? "" : "s"}
                {areaBounds ? " en esta área" : ""}
              </p>
            </div>

            <div className="relative flex items-center gap-2 rounded-xl bg-muted/60 px-3">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  resetPaging()
                }}
                placeholder="Puesto, empresa o palabra clave"
                className="h-10 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="relative flex items-center gap-2 rounded-xl bg-muted/60 px-3">
              <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  resetPaging()
                }}
                placeholder="Ubicación"
                className="h-10 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Sheet>
                <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
                  <FilterIcon className="size-4" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <JobFilters
                    {...filterProps}
                    categoryNames={categoryNames}
                    companyNames={companyNames}
                    className="px-4 pb-6"
                  />
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                <SelectTrigger className="w-44">
                  <SelectValue>{(value: SortOption) => SORT_LABELS[value]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABELS) as SortOption[])
                    .filter((key) => key !== "distancia" || userLocation)
                    .map((key) => (
                      <SelectItem key={key} value={key}>
                        {SORT_LABELS[key]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div ref={listScrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {visibleJobs.length === 0 ? (
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
              <div className="flex flex-col gap-3">
                {visibleJobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    isHovered={job.id === hoveredJobId}
                    isSelected={job.id === selectedJobId}
                    onHover={setHoveredJobId}
                    onSelect={setSelectedJobId}
                    distanceKm={distanceById.get(job.id)}
                  />
                ))}
                {hasMore && <div ref={sentinelRef} className="h-1" />}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn("min-h-0 flex-1", mobileView !== "mapa" && "hidden md:block")}
        >
          <JobMapPanel
            jobs={filteredJobs}
            hoveredJobId={hoveredJobId}
            selectedJobId={selectedJobId}
            onMarkerHover={setHoveredJobId}
            onMarkerClick={setSelectedJobId}
            userLocation={userLocation}
            geoLoading={geoLoading}
            geoError={geoError}
            onUseMyLocation={handleUseMyLocation}
            onSearchThisArea={handleSearchThisArea}
            areaSearchActive={areaBounds != null}
            onClearAreaSearch={handleClearAreaSearch}
          />
        </div>
      </div>
    </div>
  )
}

export { JobsListingClient }
