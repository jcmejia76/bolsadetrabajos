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

const GUATEMALA_CENTER: [number, number] = [14.85, -90.6]
const DEFAULT_ZOOM = 8

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
      center={GUATEMALA_CENTER}
      zoom={DEFAULT_ZOOM}
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
      <MapController userLocation={userLocation} onBoundsChange={onBoundsChange} />
    </MapContainer>
  )
}

export { LeafletMap }
