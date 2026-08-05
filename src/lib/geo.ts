export interface Country {
  name: string;
  /** ISO 4217 currency code used to price salaries for jobs posted in this country. */
  currency: string;
}

/** The 35 sovereign states of the Americas (UN member states), sorted alphabetically. */
export const COUNTRIES: Country[] = [
  { name: "Antigua y Barbuda", currency: "XCD" },
  { name: "Argentina", currency: "ARS" },
  { name: "Bahamas", currency: "BSD" },
  { name: "Barbados", currency: "BBD" },
  { name: "Belice", currency: "BZD" },
  { name: "Bolivia", currency: "BOB" },
  { name: "Brasil", currency: "BRL" },
  { name: "Canadá", currency: "CAD" },
  { name: "Chile", currency: "CLP" },
  { name: "Colombia", currency: "COP" },
  { name: "Costa Rica", currency: "CRC" },
  { name: "Cuba", currency: "CUP" },
  { name: "Dominica", currency: "XCD" },
  { name: "Ecuador", currency: "USD" },
  { name: "El Salvador", currency: "USD" },
  { name: "Estados Unidos", currency: "USD" },
  { name: "Granada", currency: "XCD" },
  { name: "Guatemala", currency: "GTQ" },
  { name: "Guyana", currency: "GYD" },
  { name: "Haití", currency: "HTG" },
  { name: "Honduras", currency: "HNL" },
  { name: "Jamaica", currency: "JMD" },
  { name: "México", currency: "MXN" },
  { name: "Nicaragua", currency: "NIO" },
  { name: "Panamá", currency: "PAB" },
  { name: "Paraguay", currency: "PYG" },
  { name: "Perú", currency: "PEN" },
  { name: "República Dominicana", currency: "DOP" },
  { name: "San Cristóbal y Nieves", currency: "XCD" },
  { name: "San Vicente y las Granadinas", currency: "XCD" },
  { name: "Santa Lucía", currency: "XCD" },
  { name: "Surinam", currency: "SRD" },
  { name: "Trinidad y Tobago", currency: "TTD" },
  { name: "Uruguay", currency: "UYU" },
  { name: "Venezuela", currency: "VES" },
];

export interface GeoCity {
  country: string;
  city: string;
  /** State/province/department — whatever the country's first-level administrative division is called. */
  department: string;
  lat: number;
  lng: number;
}

/**
 * Curated capital + major cities per country, used both to plot job markers
 * on the map and to backfill JobPosting.lat/lng at save time from
 * country/department/city. Swap for a real geocoding service if precision
 * beyond "which city" is ever needed.
 */
export const GEO_CITIES: GeoCity[] = [
  // Guatemala — one entry per department (22/22)
  { country: "Guatemala", city: "Ciudad de Guatemala", department: "Guatemala", lat: 14.6349, lng: -90.5069 },
  { country: "Guatemala", city: "Antigua Guatemala", department: "Sacatepéquez", lat: 14.5586, lng: -90.7295 },
  { country: "Guatemala", city: "Quetzaltenango", department: "Quetzaltenango", lat: 14.8447, lng: -91.5185 },
  { country: "Guatemala", city: "Escuintla", department: "Escuintla", lat: 14.305, lng: -90.785 },
  { country: "Guatemala", city: "Cobán", department: "Alta Verapaz", lat: 15.47, lng: -90.3711 },
  { country: "Guatemala", city: "Huehuetenango", department: "Huehuetenango", lat: 15.3197, lng: -91.4708 },
  { country: "Guatemala", city: "Mazatenango", department: "Suchitepéquez", lat: 14.5347, lng: -91.5033 },
  { country: "Guatemala", city: "Puerto Barrios", department: "Izabal", lat: 15.7275, lng: -88.5942 },
  { country: "Guatemala", city: "Chiquimula", department: "Chiquimula", lat: 14.7997, lng: -89.5461 },
  { country: "Guatemala", city: "Retalhuleu", department: "Retalhuleu", lat: 14.5367, lng: -91.6789 },
  { country: "Guatemala", city: "Guastatoya", department: "El Progreso", lat: 14.9407, lng: -90.0729 },
  { country: "Guatemala", city: "Chimaltenango", department: "Chimaltenango", lat: 14.6611, lng: -90.8207 },
  { country: "Guatemala", city: "Cuilapa", department: "Santa Rosa", lat: 14.2761, lng: -90.2957 },
  { country: "Guatemala", city: "Sololá", department: "Sololá", lat: 14.7724, lng: -91.1834 },
  { country: "Guatemala", city: "Totonicapán", department: "Totonicapán", lat: 14.9112, lng: -91.3616 },
  { country: "Guatemala", city: "San Marcos", department: "San Marcos", lat: 14.9634, lng: -91.7947 },
  { country: "Guatemala", city: "Santa Cruz del Quiché", department: "Quiché", lat: 15.0299, lng: -91.1494 },
  { country: "Guatemala", city: "Salamá", department: "Baja Verapaz", lat: 15.1058, lng: -90.3181 },
  { country: "Guatemala", city: "Flores", department: "Petén", lat: 16.9284, lng: -89.8918 },
  { country: "Guatemala", city: "Zacapa", department: "Zacapa", lat: 14.9722, lng: -89.5309 },
  { country: "Guatemala", city: "Jalapa", department: "Jalapa", lat: 14.6335, lng: -89.9887 },
  { country: "Guatemala", city: "Jutiapa", department: "Jutiapa", lat: 14.2917, lng: -89.8956 },

  // North America
  { country: "Canadá", city: "Ottawa", department: "Ontario", lat: 45.4215, lng: -75.6972 },
  { country: "Canadá", city: "Toronto", department: "Ontario", lat: 43.6532, lng: -79.3832 },
  { country: "Canadá", city: "Vancouver", department: "Columbia Británica", lat: 49.2827, lng: -123.1207 },
  { country: "Canadá", city: "Montreal", department: "Quebec", lat: 45.5019, lng: -73.5674 },
  { country: "Estados Unidos", city: "Washington D.C.", department: "Distrito de Columbia", lat: 38.9072, lng: -77.0369 },
  { country: "Estados Unidos", city: "Nueva York", department: "Nueva York", lat: 40.7128, lng: -74.006 },
  { country: "Estados Unidos", city: "Los Ángeles", department: "California", lat: 34.0522, lng: -118.2437 },
  { country: "Estados Unidos", city: "Miami", department: "Florida", lat: 25.7617, lng: -80.1918 },
  { country: "Estados Unidos", city: "Houston", department: "Texas", lat: 29.7604, lng: -95.3698 },
  { country: "México", city: "Ciudad de México", department: "Ciudad de México", lat: 19.4326, lng: -99.1332 },
  { country: "México", city: "Guadalajara", department: "Jalisco", lat: 20.6597, lng: -103.3496 },
  { country: "México", city: "Monterrey", department: "Nuevo León", lat: 25.6866, lng: -100.3161 },
  { country: "México", city: "Cancún", department: "Quintana Roo", lat: 21.1619, lng: -86.8515 },

  // Central America (except Guatemala)
  { country: "Belice", city: "Belmopán", department: "Cayo", lat: 17.251, lng: -88.759 },
  { country: "Belice", city: "Ciudad de Belice", department: "Belice", lat: 17.5046, lng: -88.1962 },
  { country: "Honduras", city: "Tegucigalpa", department: "Francisco Morazán", lat: 14.0723, lng: -87.1921 },
  { country: "Honduras", city: "San Pedro Sula", department: "Cortés", lat: 15.5041, lng: -88.025 },
  { country: "El Salvador", city: "San Salvador", department: "San Salvador", lat: 13.6929, lng: -89.2182 },
  { country: "El Salvador", city: "Santa Ana", department: "Santa Ana", lat: 13.9942, lng: -89.5592 },
  { country: "Nicaragua", city: "Managua", department: "Managua", lat: 12.1364, lng: -86.2514 },
  { country: "Nicaragua", city: "León", department: "León", lat: 12.434, lng: -86.878 },
  { country: "Costa Rica", city: "San José", department: "San José", lat: 9.9281, lng: -84.0907 },
  { country: "Costa Rica", city: "Alajuela", department: "Alajuela", lat: 10.0165, lng: -84.2116 },
  { country: "Panamá", city: "Ciudad de Panamá", department: "Panamá", lat: 8.9824, lng: -79.5199 },
  { country: "Panamá", city: "Colón", department: "Colón", lat: 9.3547, lng: -79.9014 },

  // Caribbean
  { country: "Cuba", city: "La Habana", department: "La Habana", lat: 23.1136, lng: -82.3666 },
  { country: "Cuba", city: "Santiago de Cuba", department: "Santiago de Cuba", lat: 20.0247, lng: -75.8219 },
  { country: "República Dominicana", city: "Santo Domingo", department: "Distrito Nacional", lat: 18.4861, lng: -69.9312 },
  { country: "República Dominicana", city: "Santiago de los Caballeros", department: "Santiago", lat: 19.4517, lng: -70.697 },
  { country: "Haití", city: "Puerto Príncipe", department: "Oeste", lat: 18.5944, lng: -72.3074 },
  { country: "Jamaica", city: "Kingston", department: "Kingston", lat: 17.9712, lng: -76.7936 },
  { country: "Trinidad y Tobago", city: "Puerto España", department: "Puerto España", lat: 10.6549, lng: -61.5019 },
  { country: "Bahamas", city: "Nasáu", department: "Nueva Providencia", lat: 25.0343, lng: -77.3963 },
  { country: "Barbados", city: "Bridgetown", department: "San Miguel", lat: 13.1132, lng: -59.5988 },
  { country: "Antigua y Barbuda", city: "Saint John's", department: "Saint John", lat: 17.1274, lng: -61.8468 },
  { country: "Dominica", city: "Roseau", department: "Saint George", lat: 15.3092, lng: -61.3794 },
  { country: "Granada", city: "Saint George's", department: "Saint George", lat: 12.0561, lng: -61.7488 },
  { country: "San Cristóbal y Nieves", city: "Basseterre", department: "Saint George Basseterre", lat: 17.3026, lng: -62.7177 },
  { country: "Santa Lucía", city: "Castries", department: "Castries", lat: 14.0101, lng: -60.9875 },
  { country: "San Vicente y las Granadinas", city: "Kingstown", department: "Saint George", lat: 13.16, lng: -61.2248 },

  // South America
  { country: "Colombia", city: "Bogotá", department: "Cundinamarca", lat: 4.711, lng: -74.0721 },
  { country: "Colombia", city: "Medellín", department: "Antioquia", lat: 6.2442, lng: -75.5812 },
  { country: "Colombia", city: "Cali", department: "Valle del Cauca", lat: 3.4516, lng: -76.532 },
  { country: "Venezuela", city: "Caracas", department: "Distrito Capital", lat: 10.4806, lng: -66.9036 },
  { country: "Venezuela", city: "Maracaibo", department: "Zulia", lat: 10.6427, lng: -71.6125 },
  { country: "Guyana", city: "Georgetown", department: "Demerara-Mahaica", lat: 6.8013, lng: -58.1551 },
  { country: "Surinam", city: "Paramaribo", department: "Paramaribo", lat: 5.852, lng: -55.2038 },
  { country: "Ecuador", city: "Quito", department: "Pichincha", lat: -0.1807, lng: -78.4678 },
  { country: "Ecuador", city: "Guayaquil", department: "Guayas", lat: -2.1894, lng: -79.8891 },
  { country: "Perú", city: "Lima", department: "Lima", lat: -12.0464, lng: -77.0428 },
  { country: "Perú", city: "Arequipa", department: "Arequipa", lat: -16.409, lng: -71.5375 },
  { country: "Bolivia", city: "La Paz", department: "La Paz", lat: -16.5, lng: -68.15 },
  { country: "Bolivia", city: "Santa Cruz de la Sierra", department: "Santa Cruz", lat: -17.7833, lng: -63.1821 },
  { country: "Bolivia", city: "Sucre", department: "Chuquisaca", lat: -19.0333, lng: -65.2627 },
  { country: "Brasil", city: "Brasilia", department: "Distrito Federal", lat: -15.7939, lng: -47.8828 },
  { country: "Brasil", city: "São Paulo", department: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { country: "Brasil", city: "Río de Janeiro", department: "Río de Janeiro", lat: -22.9068, lng: -43.1729 },
  { country: "Paraguay", city: "Asunción", department: "Asunción", lat: -25.2637, lng: -57.5759 },
  { country: "Chile", city: "Santiago", department: "Región Metropolitana", lat: -33.4489, lng: -70.6693 },
  { country: "Chile", city: "Valparaíso", department: "Valparaíso", lat: -33.0472, lng: -71.6127 },
  { country: "Argentina", city: "Buenos Aires", department: "Ciudad Autónoma de Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { country: "Argentina", city: "Córdoba", department: "Córdoba", lat: -31.4201, lng: -64.1888 },
  { country: "Argentina", city: "Rosario", department: "Santa Fe", lat: -32.9442, lng: -60.6505 },
  { country: "Uruguay", city: "Montevideo", department: "Montevideo", lat: -34.9011, lng: -56.1645 },
];

/**
 * Best-effort city/department match scoped to a country, falling back to the
 * country's most common seat (its capital, first in the curated list).
 */
export function deriveJobCoordinates(
  country?: string | null,
  department?: string | null,
  city?: string | null
): { lat: number; lng: number } | null {
  if (!country) return null

  if (city) {
    const byCity = GEO_CITIES.find((entry) => entry.country === country && entry.city === city)
    if (byCity) return { lat: byCity.lat, lng: byCity.lng }
  }
  if (department) {
    const byDepartment = GEO_CITIES.find(
      (entry) => entry.country === country && entry.department === department
    )
    if (byDepartment) return { lat: byDepartment.lat, lng: byDepartment.lng }
  }
  const byCountry = GEO_CITIES.find((entry) => entry.country === country)
  if (byCountry) return { lat: byCountry.lat, lng: byCountry.lng }

  return null
}

export function getCurrencyForCountry(country?: string | null): string {
  return COUNTRIES.find((c) => c.name === country)?.currency ?? "GTQ"
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
