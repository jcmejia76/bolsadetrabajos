"use client"

import { memo, useState } from "react"
import Link from "next/link"
import { BookmarkIcon, BriefcaseIcon, ClockIcon, MapPinIcon, WifiIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MockJob } from "@/lib/mock/jobs"
import { formatDistance } from "@/lib/mock/geo"

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy"
  if (days === 1) return "Hace 1 día"
  return `Hace ${days} días`
}

function formatSalary(job: MockJob) {
  const format = (n: number) => `${(n / 1000).toFixed(0)}k`
  return `${job.currency} ${format(job.salaryMin)} - ${format(job.salaryMax)}`
}

interface JobListItemProps {
  job: MockJob
  isHovered?: boolean
  isSelected?: boolean
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  distanceKm?: number
  className?: string
}

const JobListItem = memo(function JobListItem({
  job,
  isHovered = false,
  isSelected = false,
  onHover,
  onSelect,
  distanceKm,
  className,
}: JobListItemProps) {
  const [saved, setSaved] = useState(false)

  return (
    <div
      id={`job-item-${job.id}`}
      data-slot="job-list-item"
      role="button"
      tabIndex={0}
      onMouseEnter={() => onHover?.(job.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(job.id)}
      onBlur={() => onHover?.(null)}
      onClick={() => onSelect?.(job.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(job.id)
        }
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
          : isHovered
            ? "-translate-y-0.5 border-primary/40 bg-card shadow-lg shadow-foreground/[0.04]"
            : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.04]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyInitials}
          </span>
          <div className="flex flex-col">
            <Link
              href={`/empleos/${job.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
            >
              {job.title}
            </Link>
            <Link
              href={`/empresas/${job.companySlug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground hover:text-foreground"
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
          onClick={(e) => {
            e.stopPropagation()
            setSaved((v) => !v)
          }}
          className={cn(saved && "text-primary")}
        >
          <BookmarkIcon className={cn(saved && "fill-current")} />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {job.remote ? (
          <span className="flex items-center gap-1.5">
            <WifiIcon className="size-3.5" />
            Remoto
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5" />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <BriefcaseIcon className="size-3.5" />
          {job.modality}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="size-3.5" />
          {job.schedule}
        </span>
        {distanceKm != null && (
          <span className="flex items-center gap-1.5 font-medium text-primary">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="h-5.5 rounded-full px-2 text-xs">
          {formatSalary(job)}
        </Badge>
        {job.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="h-5.5 rounded-full px-2 text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {formatRelativeDays(job.postedDaysAgo)}
        </span>
        <Button
          size="sm"
          variant="outline"
          render={<Link href={`/empleos/${job.slug}`} onClick={(e) => e.stopPropagation()} />}
          nativeButton={false}
        >
          Ver oferta
        </Button>
      </div>
    </div>
  )
})

export { JobListItem }
