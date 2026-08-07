"use client"

import dynamic from "next/dynamic"
import { useCallback, useRef, useState } from "react"
import { Loader2Icon, LocateFixedIcon, SearchIcon } from "lucide-react"
import type L from "leaflet"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { JobCardData } from "@/lib/job-view-model"

const LeafletMap = dynamic(() => import("./leaflet-map").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
})

interface JobMapPanelProps {
  jobs: JobCardData[]
  hoveredJobId: string | null
  selectedJobId: string | null
  onMarkerHover: (id: string | null) => void
  onMarkerClick: (id: string) => void
  userLocation: { lat: number; lng: number } | null
  geoLoading: boolean
  geoError: string | null
  onUseMyLocation: () => void
  onSearchThisArea: (bounds: L.LatLngBounds) => void
  areaSearchActive: boolean
  onClearAreaSearch: () => void
  className?: string
}

function JobMapPanel({
  jobs,
  hoveredJobId,
  selectedJobId,
  onMarkerHover,
  onMarkerClick,
  userLocation,
  geoLoading,
  geoError,
  onUseMyLocation,
  onSearchThisArea,
  areaSearchActive,
  onClearAreaSearch,
  className,
}: JobMapPanelProps) {
  const [showSearchArea, setShowSearchArea] = useState(false)
  const currentBoundsRef = useRef<L.LatLngBounds | null>(null)

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    currentBoundsRef.current = bounds
    setShowSearchArea(true)
  }, [])

  const handleSearchThisArea = useCallback(() => {
    if (currentBoundsRef.current) {
      onSearchThisArea(currentBoundsRef.current)
      setShowSearchArea(false)
    }
  }, [onSearchThisArea])

  const handleClear = useCallback(() => {
    onClearAreaSearch()
    setShowSearchArea(false)
  }, [onClearAreaSearch])

  return (
    <div className={cn("isolate relative size-full overflow-hidden", className)}>
      <LeafletMap
        jobs={jobs}
        hoveredJobId={hoveredJobId}
        selectedJobId={selectedJobId}
        onMarkerHover={onMarkerHover}
        onMarkerClick={onMarkerClick}
        userLocation={userLocation}
        onBoundsChange={handleBoundsChange}
        onMapReady={() => {}}
      />

      <div className="pointer-events-none absolute inset-x-0 top-4 z-[500] flex flex-col items-center gap-2">
        {showSearchArea && (
          <Button
            size="sm"
            onClick={handleSearchThisArea}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <SearchIcon className="size-3.5" />
            Buscar en esta área
          </Button>
        )}
        {areaSearchActive && !showSearchArea && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleClear}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            Quitar filtro de área
          </Button>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-4 z-[500] flex flex-col items-center gap-2">
        {geoError && (
          <span className="rounded-lg bg-card px-3 py-1.5 text-xs text-destructive shadow-md">
            {geoError}
          </span>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={onUseMyLocation}
          disabled={geoLoading}
          className="rounded-full shadow-lg"
        >
          {geoLoading ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <LocateFixedIcon className="size-3.5" />
          )}
          Usar mi ubicación
        </Button>
      </div>
    </div>
  )
}

export { JobMapPanel }
