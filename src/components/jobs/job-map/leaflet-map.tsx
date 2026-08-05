"use client"

import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useTheme } from "next-themes"

import type { JobCardData } from "@/lib/job-view-model"
import { MarkerClusterGroup } from "./marker-cluster-group"

const LIGHT_TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

/** Fallback view when there are no geolocated jobs yet — roughly centered on the Americas. */
const AMERICAS_CENTER: [number, number] = [10, -80]
const AMERICAS_ZOOM = 3

interface MapControllerProps {
  userLocation: { lat: number; lng: number } | null
  onBoundsChange: (bounds: L.LatLngBounds) => void
}

function MapController({ userLocation, onBoundsChange }: MapControllerProps) {
  const map = useMap()
  const userMarkerRef = useRef<L.CircleMarker | null>(null)

  useEffect(() => {
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current)
      userMarkerRef.current = null
    }
    if (userLocation) {
      const marker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#3b6fe0",
        fillOpacity: 1,
      }).addTo(map)
      userMarkerRef.current = marker
      map.flyTo([userLocation.lat, userLocation.lng], 12, { duration: 0.9 })
    }
    return () => {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current)
        userMarkerRef.current = null
      }
    }
  }, [userLocation, map])

  useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  })

  return null
}

/** Frames the map around the jobs available on first load, since they may be anywhere in the Americas. */
function FitToJobsOnMount({ jobs }: { jobs: JobCardData[] }) {
  const map = useMap()
  const didFit = useRef(false)

  useEffect(() => {
    if (didFit.current) return
    const coords = jobs
      .filter((job): job is JobCardData & { lat: number; lng: number } => job.lat != null && job.lng != null)
      .map((job) => [job.lat, job.lng] as [number, number])
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [48, 48], maxZoom: 12 })
      didFit.current = true
    }
  }, [jobs, map])

  return null
}

interface LeafletMapProps {
  jobs: JobCardData[]
  hoveredJobId: string | null
  selectedJobId: string | null
  onMarkerHover: (id: string | null) => void
  onMarkerClick: (id: string) => void
  userLocation: { lat: number; lng: number } | null
  onBoundsChange: (bounds: L.LatLngBounds) => void
  onMapReady: (map: L.Map) => void
}

function LeafletMap({
  jobs,
  hoveredJobId,
  selectedJobId,
  onMarkerHover,
  onMarkerClick,
  userLocation,
  onBoundsChange,
  onMapReady,
}: LeafletMapProps) {
  const { resolvedTheme } = useTheme()
  const mapRef = useRef<L.Map | null>(null)

  return (
    <MapContainer
      center={AMERICAS_CENTER}
      zoom={AMERICAS_ZOOM}
      className="size-full"
      zoomControl={false}
      ref={(map) => {
        if (map && mapRef.current !== map) {
          mapRef.current = map
          onMapReady(map)
        }
      }}
    >
      <TileLayer
        key={resolvedTheme === "dark" ? "dark" : "light"}
        url={resolvedTheme === "dark" ? DARK_TILE_URL : LIGHT_TILE_URL}
        attribution={TILE_ATTRIBUTION}
      />
      <MarkerClusterGroup
        jobs={jobs}
        hoveredJobId={hoveredJobId}
        selectedJobId={selectedJobId}
        onMarkerHover={onMarkerHover}
        onMarkerClick={onMarkerClick}
      />
      <FitToJobsOnMount jobs={jobs} />
      <MapController userLocation={userLocation} onBoundsChange={onBoundsChange} />
    </MapContainer>
  )
}

export { LeafletMap }
