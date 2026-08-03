import { mockJobs, type MockJob } from "./jobs"

export type MockApplicationStatus =
  | "Recibida"
  | "En revisión"
  | "Preseleccionado"
  | "Entrevista"
  | "Rechazado"
  | "Contratado"

export interface MockApplication {
  id: string
  job: MockJob
  status: MockApplicationStatus
  appliedDaysAgo: number
}

function findJob(slug: string): MockJob {
  const job = mockJobs.find((j) => j.slug === slug)
  if (!job) throw new Error(`Mock job not found: ${slug}`)
  return job
}

export const mockApplications: MockApplication[] = [
  {
    id: "application-1",
    job: findJob("senior-frontend-engineer-nimbus-tech"),
    status: "Entrevista",
    appliedDaysAgo: 4,
  },
  {
    id: "application-2",
    job: findJob("diseñador-a-de-producto-orbita-creativa"),
    status: "En revisión",
    appliedDaysAgo: 6,
  },
  {
    id: "application-3",
    job: findJob("backend-engineer-nodejs-nimbus-tech"),
    status: "Recibida",
    appliedDaysAgo: 1,
  },
  {
    id: "application-4",
    job: findJob("especialista-en-marketing-digital-orbita"),
    status: "Rechazado",
    appliedDaysAgo: 12,
  },
]
