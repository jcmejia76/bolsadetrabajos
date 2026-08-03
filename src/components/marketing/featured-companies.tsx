import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { CompanyCard } from "@/components/companies/company-card"
import { mockCompanies } from "@/lib/mock/companies"

function FeaturedCompanies() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Empresas destacadas
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Compañías verificadas que están construyendo equipos en este
            momento.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          render={<Link href="/empresas" />}
          nativeButton={false}
        >
          Ver todas las empresas
          <ArrowRightIcon className="size-4" />
        </Button>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.slice(0, 3).map((company) => (
          <StaggerItem key={company.slug}>
            <CompanyCard company={company} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export { FeaturedCompanies }
