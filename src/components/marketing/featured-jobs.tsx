import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { JobCard } from "@/components/jobs/job-card"
import { mockJobs } from "@/lib/mock/jobs"

function FeaturedJobs() {
  const featured = mockJobs.filter((job) => job.featured).slice(0, 6)

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Vacantes destacadas
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Oportunidades seleccionadas de empresas que están contratando
              activamente esta semana.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            render={<Link href="/empleos" />}
            nativeButton={false}
          >
            Ver todas las vacantes
            <ArrowRightIcon className="size-4" />
          </Button>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <StaggerItem key={job.id}>
              <JobCard job={job} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export { FeaturedJobs }
