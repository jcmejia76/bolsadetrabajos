import type { JobCardData } from "@/lib/job-view-model"

function formatSalary(job: JobCardData) {
  if (job.salaryMin == null && job.salaryMax == null) return "A convenir"
  const format = (n: number) => `${(n / 1000).toFixed(0)}k`
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${job.currency} ${format(job.salaryMin)} - ${format(job.salaryMax)}`
  }
  return `${job.currency} ${format((job.salaryMin ?? job.salaryMax)!)}`
}

/**
 * Rendered via renderToStaticMarkup into a Leaflet popup's HTML — keep this
 * free of interactivity (no onClick handlers survive the static render, the
 * "Ver detalles" link works as a plain anchor).
 */
function JobMapPopupContent({ job }: { job: JobCardData }) {
  return (
    <div className="flex w-64 flex-col gap-3 p-3.5 pr-7">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyInitials}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-foreground">{job.title}</span>
          <span className="truncate text-xs text-muted-foreground">{job.companyName}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{job.remote ? "Remoto" : job.location}</span>
        <span>·</span>
        <span>{job.modality}</span>
        <span>·</span>
        <span>{job.schedule}</span>
      </div>

      <span className="inline-flex h-5.5 w-fit items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground">
        {formatSalary(job)}
      </span>

      <a
        href={`/empleos/${job.slug}`}
        className="mt-1 inline-flex h-8 w-full items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ver detalles
      </a>
    </div>
  )
}

export { JobMapPopupContent }
