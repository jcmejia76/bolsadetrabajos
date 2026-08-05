import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { listCategoriesWithJobCounts } from "@/services/job-posting/job-posting-public.service"
import { getCategoryIcon } from "@/lib/job-category-icons"

async function PopularCategories() {
  const categories = await listCategoriesWithJobCounts()

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Categorías populares
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explora vacantes organizadas por industria y encuentra la que se
          ajusta a tu experiencia.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug)
          return (
            <StaggerItem key={category.slug}>
              <Link
                href={`/empleos?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <ArrowRightIcon className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category._count.jobPostings} vacante{category._count.jobPostings === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}

export { PopularCategories }
