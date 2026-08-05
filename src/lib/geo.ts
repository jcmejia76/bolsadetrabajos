export interface GeoCity {
  city: string
  department: string
  lat: number
  lng: number
}

/**
 * Approximate coordinates for the municipal seat of each city, used both to
 * plot job markers on the map and to backfill JobPosting.lat/lng at
 * save time from its city/department. Swap for a real geocoding service if
 * precision beyond "which city" is ever needed.
 */
/** One entry per Guatemala department (22/22) so every department has an exact, matchable seat. */
export const GEO_CITIES: GeoCity[] = [
  { city: "Ciudad de Guatemala", department: "Guatemala", lat: 14.6349, lng: -90.5069 },
  { city: "Antigua Guatemala", department: "Sacatepéquez", lat: 14.5586, lng: -90.7295 },
  { city: "Quetzaltenango", department: "Quetzaltenango", lat: 14.8447, lng: -91.5185 },
  { city: "Escuintla", department: "Escuintla", lat: 14.305, lng: -90.785 },
  { city: "Cobán", department: "Alta Verapaz", lat: 15.47, lng: -90.3711 },
  { city: "Huehuetenango", department: "Huehuetenango", lat: 15.3197, lng: -91.4708 },
  { city: "Mazatenango", department: "Suchitepéquez", lat: 14.5347, lng: -91.5033 },
  { city: "Puerto Barrios", department: "Izabal", lat: 15.7275, lng: -88.5942 },
  { city: "Chiquimula", department: "Chiquimula", lat: 14.7997, lng: -89.5461 },
  { city: "Retalhuleu", department: "Retalhuleu", lat: 14.5367, lng: -91.6789 },
  { city: "Guastatoya", department: "El Progreso", lat: 14.9407, lng: -90.0729 },
  { city: "Chimaltenango", department: "Chimaltenango", lat: 14.6611, lng: -90.8207 },
  { city: "Cuilapa", department: "Santa Rosa", lat: 14.2761, lng: -90.2957 },
  { city: "Sololá", department: "Sololá", lat: 14.7724, lng: -91.1834 },
  { city: "Totonicapán", department: "Totonicapán", lat: 14.9112, lng: -91.3616 },
  { city: "San Marcos", department: "San Marcos", lat: 14.9634, lng: -91.7947 },
  { city: "Santa Cruz del Quiché", department: "Quiché", lat: 15.0299, lng: -91.1494 },
  { city: "Salamá", department: "Baja Verapaz", lat: 15.1058, lng: -90.3181 },
  { city: "Flores", department: "Petén", lat: 16.9284, lng: -89.8918 },
  { city: "Zacapa", department: "Zacapa", lat: 14.9722, lng: -89.5309 },
  { city: "Jalapa", department: "Jalapa", lat: 14.6335, lng: -89.9887 },
  { city: "Jutiapa", department: "Jutiapa", lat: 14.2917, lng: -89.8956 },
]

export function findGeoCity(city: string): GeoCity | undefined {
  return GEO_CITIES.find((entry) => entry.city === city)
}

/** Best-effort city/department match, falling back to the department's most common seat. */
export function deriveJobCoordinates(
  city?: string | null,
  department?: string | null
): { lat: number; lng: number } | null {
  if (city) {
    const byCity = GEO_CITIES.find((entry) => entry.city === city)
    if (byCity) return { lat: byCity.lat, lng: byCity.lng }
  }
  if (department) {
    const byDepartment = GEO_CITIES.find((entry) => entry.department === department)
    if (byDepartment) return { lat: byDepartment.lat, lng: byDepartment.lng }
  }
  return null
}

export interface LatLng {
  lat: number
  lng: number
}

const EARTH_RADIUS_KM = 6371

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return EARTH_RADIUS_KM * c
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(km < 10 ? 1 : 0)} km`
}
