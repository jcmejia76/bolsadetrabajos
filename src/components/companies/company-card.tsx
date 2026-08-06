import Link from "next/link"
import { BadgeCheckIcon, BriefcaseIcon, MapPinIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { CompanyCardData } from "@/lib/company-view-model"

interface CompanyCardProps {
  company: CompanyCardData
  className?: string
}

function CompanyCard({ company, className }: CompanyCardProps) {
  return (
    <div
      data-slot="company-card"
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-primary to-success transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white shadow-sm"
          style={{ backgroundColor: company.color }}
        >
          {company.initials}
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/empresas/${company.slug}`}
              className="font-semibold text-foreground transition-colors group-hover:text-primary"
            >
              {company.name}
            </Link>
            {company.verified && (
              <BadgeCheckIcon className="size-4 shrink-0 text-primary" aria-label="Empresa verificada" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {company.industry}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
          <MapPinIcon className="size-3.5" />
          {company.location}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 font-medium text-primary">
          <BriefcaseIcon className="size-3.5" />
          {company.jobCount} vacante{company.jobCount === 1 ? "" : "s"}
        </span>
      </div>

      <Button
        variant="outline"
        className="mt-1 w-full rounded-xl group-hover:border-primary/40 group-hover:text-primary"
        render={<Link href={`/empresas/${company.slug}`} />}
        nativeButton={false}
      >
        Ver empresa
      </Button>
    </div>
  )
}

export { CompanyCard }
