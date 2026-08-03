"use client"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, BriefcaseIcon, ClockIcon, MapPinIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MockJob } from "@/lib/mock/jobs"

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy"
  if (days === 1) return "Hace 1 día"
  return `Hace ${days} días`
}

function formatSalary(job: MockJob) {
  const format = (n: number) => `${(n / 1000).toFixed(0)}k`
  return `${job.currency} ${format(job.salaryMin)} - ${format(job.salaryMax)}`
}

interface JobCardProps {
  job: MockJob
  className?: string
  initialSaved?: boolean
}

function JobCard({ job, className, initialSaved = false }: JobCardProps) {
  const [saved, setSaved] = useState(initialSaved)

  return (
    <div
      data-slot="job-card"
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.04]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyInitials}
          </span>
          <div className="flex flex-col">
            <Link
              href={`/empleos/${job.slug}`}
              className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary"
            >
              {job.title}
            </Link>
            <Link
              href={`/empresas/${job.companySlug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {job.companyName}
            </Link>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-pressed={saved}
          aria-label={saved ? "Quitar de guardados" : "Guardar empleo"}
          onClick={() => setSaved((v) => !v)}
          className={cn(saved && "text-primary")}
        >
          <BookmarkIcon className={cn(saved && "fill-current")} />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
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
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="h-6 rounded-full px-2.5">
          {formatSalary(job)}
        </Badge>
        {job.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="h-6 rounded-full px-2.5">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {formatRelativeDays(job.postedDaysAgo)}
        </span>
        <Button size="sm" render={<Link href={`/empleos/${job.slug}`} />} nativeButton={false}>
          Aplicar
        </Button>
      </div>
    </div>
  )
}

export { JobCard }
