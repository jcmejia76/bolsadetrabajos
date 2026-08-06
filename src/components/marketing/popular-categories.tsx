import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { listCategoriesWithJobCounts } from "@/services/job-posting/job-posting-public.service"
import { getCategoryIcon } from "@/lib/job-category-icons"

const ICON_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const MAX_VISIBLE_CATEGORIES = 8

async function PopularCategories() {
  const allCategories = await listCategoriesWithJobCounts()
  const categories = allCategories.slice(0, MAX_VISIBLE_CATEGORIES)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">Explora por categoría</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Categorías populares
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explora vacantes organizadas por industria y encuentra la que se
          ajusta a tu experiencia.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => {
          const Icon = getCategoryIcon(category.slug)
          const color = ICON_COLORS[i % ICON_COLORS.length]
          return (
            <StaggerItem key={category.slug}>
              <Link
                href={`/empleos?category=${encodeURIComponent(category.name)}`}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="relative flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_oklch,var(--cat-color)_14%,transparent)] text-[color:var(--cat-color)] transition-transform duration-300 group-hover:scale-110"
                  style={{ "--cat-color": color } as CSSProperties}
                >
                  <Icon className="size-5" />
                </span>
                <div className="relative">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category._count.jobPostings} vacante{category._count.jobPostings === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>

      <div className="mt-10 text-center">
        <Link
          href="/empleos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Ver todas las categorías
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}

export { PopularCategories }
