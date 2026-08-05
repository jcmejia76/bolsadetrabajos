import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { EmptyState } from "@/components/ui/empty-state"
import { JobCard } from "@/components/jobs/job-card"
import { BriefcaseIcon } from "lucide-react"
import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import { listPublishedJobPostings } from "@/services/job-posting/job-posting-public.service"
import { listFavoriteJobIds } from "@/services/favorite/favorite.service"
import { mapJobPostingToCardData } from "@/lib/job-view-model"

async function FeaturedJobs() {
  const [session, jobPostings] = await Promise.all([auth(), listPublishedJobPostings()])
  const favoritedIds =
    session?.user?.role === Role.CANDIDATO && session.user.candidateId
      ? await listFavoriteJobIds(session.user.candidateId)
      : undefined
  const featuredPostings = jobPostings.filter((job) => job.isFeatured)
  // Falls back to the most recent published jobs once there's no curated "featured" pick yet.
  const picks = (featuredPostings.length > 0 ? featuredPostings : jobPostings).slice(0, 6)
  const featured = picks.map((job) => mapJobPostingToCardData(job, favoritedIds))

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

        {featured.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon />}
            title="Aún no hay vacantes publicadas"
            description="Vuelve pronto — las empresas están preparando sus primeras ofertas."
          />
        ) : (
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <StaggerItem key={job.id}>
                <JobCard job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

export { FeaturedJobs }
