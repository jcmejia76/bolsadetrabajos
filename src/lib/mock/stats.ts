export interface MockStat {
  label: string
  value: number
  suffix?: string
}

export const heroStats: MockStat[] = [
  { label: "Empresas registradas", value: 1240, suffix: "+" },
  { label: "Vacantes activas", value: 3800, suffix: "+" },
  { label: "Candidatos", value: 52000, suffix: "+" },
  { label: "Contrataciones", value: 9600, suffix: "+" },
]

export const platformStats: MockStat[] = [
  { label: "Empresas confiando en nosotros", value: 1240, suffix: "+" },
  { label: "Vacantes publicadas este mes", value: 3800, suffix: "+" },
  { label: "Candidatos activos", value: 52000, suffix: "+" },
  { label: "Contrataciones exitosas", value: 9600, suffix: "+" },
]
