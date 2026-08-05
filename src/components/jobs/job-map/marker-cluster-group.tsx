"use client"

import { useEffect, useRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import L from "leaflet"
import "leaflet.markercluster"
import { useMap } from "react-leaflet"

import type { JobCardData } from "@/lib/job-view-model"
import { createClusterIcon, createJobMarkerIcon } from "./job-marker-icon"
import { JobMapPopupContent } from "./job-map-popup"

interface MarkerClusterGroupProps {
  jobs: JobCardData[]
  hoveredJobId: string | null
  selectedJobId: string | null
  onMarkerHover: (id: string | null) => void
  onMarkerClick: (id: string) => void
}

function MarkerClusterGroup({
  jobs,
  hoveredJobId,
  selectedJobId,
  onMarkerHover,
  onMarkerClick,
}: MarkerClusterGroupProps) {
  const map = useMap()
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const markersRef = useRef<globalThis.Map<string, L.Marker>>(new globalThis.Map())
  const callbacksRef = useRef({ onMarkerHover, onMarkerClick })
  useEffect(() => {
    callbacksRef.current = { onMarkerHover, onMarkerClick }
  })

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => createClusterIcon(cluster.getChildCount()),
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    })
    clusterGroupRef.current = clusterGroup
    map.addLayer(clusterGroup)
    return () => {
      map.removeLayer(clusterGroup)
      clusterGroupRef.current = null
      markersRef.current.clear()
    }
  }, [map])

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current
    if (!clusterGroup) return

    clusterGroup.clearLayers()
    const newMarkers = new globalThis.Map<string, L.Marker>()

    for (const job of jobs) {
      if (job.lat == null || job.lng == null) continue
      const state = job.id === selectedJobId ? "selected" : job.id === hoveredJobId ? "hovered" : "default"
      const marker = L.marker([job.lat, job.lng], { icon: createJobMarkerIcon(state) })
      marker.on("click", () => callbacksRef.current.onMarkerClick(job.id))
      marker.on("mouseover", () => callbacksRef.current.onMarkerHover(job.id))
      marker.on("mouseout", () => callbacksRef.current.onMarkerHover(null))
      marker.bindPopup(renderToStaticMarkup(<JobMapPopupContent job={job} />), {
        className: "job-map-popup",
        maxWidth: 280,
        minWidth: 240,
      })
      newMarkers.set(job.id, marker)
      clusterGroup.addLayer(marker)
    }

    markersRef.current = newMarkers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs])

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const state = id === selectedJobId ? "selected" : id === hoveredJobId ? "hovered" : "default"
      marker.setIcon(createJobMarkerIcon(state))
    }
  }, [hoveredJobId, selectedJobId])

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current
    if (!clusterGroup || !selectedJobId) return
    const marker = markersRef.current.get(selectedJobId)
    if (marker) {
      clusterGroup.zoomToShowLayer(marker, () => {
        marker.openPopup()
      })
    }
  }, [selectedJobId])

  return null
}

export { MarkerClusterGroup }
