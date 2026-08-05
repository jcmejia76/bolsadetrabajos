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
        "group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.04]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white"
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
              <BadgeCheckIcon className="size-4 text-primary" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {company.industry}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {company.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" />
          {company.location}
        </span>
        <span className="flex items-center gap-1.5">
          <BriefcaseIcon className="size-3.5" />
          {company.jobCount} vacantes
        </span>
      </div>

      <Button
        variant="outline"
        className="mt-1 w-full"
        render={<Link href={`/empresas/${company.slug}`} />}
        nativeButton={false}
      >
        Ver empresa
      </Button>
    </div>
  )
}

export { CompanyCard }
