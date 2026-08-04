import L from "leaflet"

export type MarkerState = "default" | "hovered" | "selected"

const BRIEFCASE_PATH =
  '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>'

function markerHtml(state: MarkerState) {
  const modifier = state === "selected" ? " job-marker--selected" : state === "hovered" ? " job-marker--hovered" : ""
  return `
    <div class="job-marker${modifier}">
      <svg class="job-marker__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${BRIEFCASE_PATH}
      </svg>
    </div>
  `
}

export function createJobMarkerIcon(state: MarkerState = "default"): L.DivIcon {
  return L.divIcon({
    html: markerHtml(state),
    className: "job-marker-wrapper",
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  })
}

export function createClusterIcon(count: number): L.DivIcon {
  const size = count < 10 ? 38 : count < 50 ? 44 : 50
  return L.divIcon({
    html: `<div class="job-cluster" style="width:${size}px;height:${size}px">${count}</div>`,
    className: "job-cluster-wrapper",
    iconSize: [size, size],
  })
}
