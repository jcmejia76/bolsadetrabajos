import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { JobCard } from "@/components/jobs/job-card"
import { mockCompanies } from "@/lib/mock/companies"
import { mockJobs } from "@/lib/mock/jobs"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = mockCompanies.find((c) => c.slug === slug)
  return { title: company ? company.name : "Empresa no encontrada" }
}

const GALLERY_TILES = 6

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = mockCompanies.find((c) => c.slug === slug)

  if (!company) {
    notFound()
  }

  const openJobs = mockJobs.filter((job) => job.companySlug === company.slug)

  return (
    <div>
      <div
        className="relative h-48 w-full sm:h-56"
        style={{
          background: `linear-gradient(120deg, ${company.color}, color-mix(in oklch, ${company.color}, black 30%))`,
        }}
      >
        <div className="absolute inset-0 bg-grid-fade opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative z-10 -mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span
                className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background text-2xl font-semibold text-white shadow-lg sm:size-28"
                style={{ backgroundColor: company.color }}
              >
                {company.initials}
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <BadgeCheckIcon className="size-5 text-primary" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {company.industry}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5" />
              {company.location}
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon className="size-3.5" />
              {company.employeeRange} empleados
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5" />
              Fundada en {company.foundedYear}
            </span>
            <span className="flex items-center gap-1.5">
              <BriefcaseIcon className="size-3.5" />
              {openJobs.length} vacante{openJobs.length === 1 ? "" : "s"}{" "}
              abierta{openJobs.length === 1 ? "" : "s"}
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 pb-16 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Sobre la empresa
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {company.longDescription}
                </p>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <section>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Vacantes abiertas
                </h2>
                {openJobs.length === 0 ? (
                  <EmptyState
                    icon={<BriefcaseIcon />}
                    title="Sin vacantes activas por ahora"
                    description={`${company.name} no tiene vacantes publicadas en este momento. Vuelve pronto.`}
                  />
                ) : (
                  <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {openJobs.map((job) => (
                      <StaggerItem key={job.id}>
                        <JobCard job={job} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                )}
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Beneficios
                </h2>
                <div className="flex flex-wrap gap-2">
                  {company.benefits.map((benefit) => (
                    <Badge
                      key={benefit}
                      variant="secondary"
                      className="h-7 rounded-full px-3 text-[13px]"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.15}>
              <section>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Galería
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: GALLERY_TILES }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl"
                      style={{
                        background: `linear-gradient(${135 + i * 20}deg, color-mix(in oklch, ${company.color}, transparent ${20 + i * 8}%), color-mix(in oklch, ${company.color}, white ${10 + i * 6}%))`,
                      }}
                    />
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Información de contacto
              </h3>
              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <GlobeIcon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Sitio web</dt>
                    <dd className="truncate font-medium text-foreground">
                      {company.website}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MailIcon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Correo</dt>
                    <dd className="truncate font-medium text-foreground">
                      {company.email}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Teléfono</dt>
                    <dd className="font-medium text-foreground">
                      {company.phone}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Dirección</dt>
                    <dd className="font-medium text-foreground">
                      {company.address}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <Link
              href="/empresas"
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Volver a todas las empresas
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
