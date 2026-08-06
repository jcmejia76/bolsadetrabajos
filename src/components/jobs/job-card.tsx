"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { BadgeCheckIcon, BookmarkIcon, BriefcaseIcon, ClockIcon, MapPinIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { JobCardData } from "@/lib/job-view-model"
import { toggleFavoriteAction } from "@/lib/actions/favorites"

function formatRelativeDays(days: number) {
  if (days <= 0) return "Hoy"
  if (days === 1) return "Hace 1 día"
  return `Hace ${days} días`
}

function formatSalary(job: JobCardData) {
  if (job.salaryMin == null && job.salaryMax == null) return null
  const format = (n: number) => `${(n / 1000).toFixed(0)}k`
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${job.currency} ${format(job.salaryMin)} - ${format(job.salaryMax)}`
  }
  return `${job.currency} ${format((job.salaryMin ?? job.salaryMax)!)}`
}

interface JobCardProps {
  job: JobCardData
  className?: string
}

function JobCard({ job, className }: JobCardProps) {
  const [saved, setSaved] = useState(job.isFavorited)
  const [isPending, startTransition] = useTransition()
  const salary = formatSalary(job)

  function handleToggleSave() {
    const next = !saved
    setSaved(next)
    startTransition(async () => {
      const result = await toggleFavoriteAction(job.id)
      if (!result.success) {
        setSaved(!next)
        toast.error(result.error)
        return
      }
      toast.success(result.data.favorited ? "Empleo guardado" : "Empleo removido de guardados")
    })
  }

  return (
    <div
      data-slot="job-card"
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)]",
        className
      )}
    >
      {job.featured && (
        <span className="absolute top-0 right-5 flex items-center gap-1 rounded-b-lg bg-gradient-to-r from-primary to-[oklch(0.5_0.19_265)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
          <SparklesIcon className="size-3" />
          Destacada
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
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
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {job.companyName}
              <BadgeCheckIcon className="size-3.5 shrink-0 text-primary" aria-label="Empresa verificada" />
            </Link>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-pressed={saved}
          aria-label={saved ? "Quitar de guardados" : "Guardar empleo"}
          onClick={handleToggleSave}
          disabled={isPending}
          className={cn("shrink-0 transition-transform active:scale-90", saved && "text-primary")}
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
        {salary && (
          <Badge className="h-6 rounded-full border-none bg-success/12 px-2.5 text-success">
            {salary}
          </Badge>
        )}
        {job.experienceLevelLabel && (
          <Badge variant="secondary" className="h-6 rounded-full px-2.5">
            {job.experienceLevelLabel}
          </Badge>
        )}
        {job.tags.slice(0, salary ? 2 : 3).map((tag) => (
          <Badge key={tag} variant="outline" className="h-6 rounded-full px-2.5">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {formatRelativeDays(job.postedDaysAgo)}
        </span>
        <Button
          size="sm"
          className="rounded-lg shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-shadow hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)]"
          render={<Link href={`/empleos/${job.slug}`} />}
          nativeButton={false}
        >
          Aplicar
        </Button>
      </div>
    </div>
  )
}

export { JobCard }
