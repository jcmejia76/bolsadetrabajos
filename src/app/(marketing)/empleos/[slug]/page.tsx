import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  GraduationCapIcon,
  MapPinIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { JobCard } from "@/components/jobs/job-card"
import { JobDetailActions } from "@/components/jobs/job-detail-actions"
import {
  getPublishedJobPostingBySlug,
  listSimilarPublishedJobPostings,
} from "@/services/job-posting/job-posting-public.service"
import { hasCandidateApplied } from "@/services/application/application.service"
import { listFavoriteJobIds } from "@/services/favorite/favorite.service"
import { mapJobPostingDetailToCardData, mapJobPostingToCardData } from "@/lib/job-view-model"

function formatSalaryFull(min: number | null, max: number | null, currency: string) {
  if (min == null && max == null) return "A convenir"
  if (min != null && max != null) {
    return `${currency} ${min.toLocaleString("es")} - ${max.toLocaleString("es")}`
  }
  return `${currency} ${(min ?? max)!.toLocaleString("es")}`
}

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy"
  if (days === 1) return "Hace 1 día"
  return `Hace ${days} días`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job = await getPublishedJobPostingBySlug(slug)
  return { title: job ? `${job.title} en ${job.company.name}` : "Empleo no encontrado" }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const jobPosting = await getPublishedJobPostingBySlug(slug)

  if (!jobPosting) {
    notFound()
  }

  const [session, similar] = await Promise.all([
    auth(),
    listSimilarPublishedJobPostings(jobPosting.categoryId, jobPosting.id),
  ])

  const candidateId =
    session?.user?.role === Role.CANDIDATO ? (session.user.candidateId ?? null) : null
  const [hasApplied, favoritedIds] = await Promise.all([
    candidateId ? hasCandidateApplied(candidateId, jobPosting.id) : Promise.resolve(false),
    candidateId ? listFavoriteJobIds(candidateId) : Promise.resolve(undefined),
  ])

  const job = mapJobPostingDetailToCardData(jobPosting, favoritedIds)
  const similarJobs = similar.map((j) => mapJobPostingToCardData(j, favoritedIds))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/empleos">Empleos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/empleos?category=${encodeURIComponent(job.category)}`}
            >
              {job.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {job.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Reveal>
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
              style={{ backgroundColor: job.companyColor }}
            >
              {job.companyInitials}
            </span>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {job.title}
              </h1>
              <Link
                href={`/empresas/${job.companySlug}`}
                className="w-fit text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {job.companyName}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <BriefcaseIcon className="size-3.5" />
                  {job.modality}
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="size-3.5" />
                  {job.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5" />
                  {formatRelativeDays(job.postedDaysAgo)}
                </span>
              </div>
            </div>
          </div>

          <JobDetailActions
            jobPostingId={jobPosting.id}
            jobSlug={jobPosting.slug}
            jobTitle={job.title}
            hasApplied={hasApplied}
            initialSaved={job.isFavorited}
            className="sm:flex-col-reverse sm:items-stretch"
          />
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <Reveal>
            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Descripción del puesto
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {job.description}
              </p>
            </section>
          </Reveal>

          {job.responsibilities.length > 0 && (
            <Reveal delay={0.05}>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Responsabilidades
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {job.requirements.length > 0 && (
            <Reveal delay={0.1}>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Requisitos
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <GraduationCapIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {job.benefits.length > 0 && (
            <Reveal delay={0.15}>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Beneficios
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="h-7 rounded-full px-3 text-[13px]">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Reveal className="sticky top-24 flex flex-col gap-5">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Resumen de la vacante
              </h3>
              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <WalletIcon className="size-4 text-primary" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Salario</dt>
                    <dd className="font-medium text-foreground">
                      {formatSalaryFull(job.salaryMin, job.salaryMax, job.currency)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="size-4 text-primary" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Ubicación</dt>
                    <dd className="font-medium text-foreground">{job.location}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BriefcaseIcon className="size-4 text-primary" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Modalidad · Jornada</dt>
                    <dd className="font-medium text-foreground">
                      {job.modality} · {job.schedule}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UsersIcon className="size-4 text-primary" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Postulantes</dt>
                    <dd className="font-medium text-foreground">
                      {job.applicantsCount} personas
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: job.companyColor }}
                >
                  {job.companyInitials}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      {job.companyName}
                    </span>
                    <BadgeCheckIcon className="size-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {job.category}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                render={<Link href={`/empresas/${job.companySlug}`} />}
                nativeButton={false}
              >
                Ver perfil de empresa
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {similarJobs.length > 0 && (
        <Reveal className="mt-14">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-foreground">
            Empleos similares
          </h2>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarJobs.map((similar) => (
              <StaggerItem key={similar.id}>
                <JobCard job={similar} />
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      )}
    </div>
  )
}
