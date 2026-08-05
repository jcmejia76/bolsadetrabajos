"use client"

import Link from "next/link"
import {
  MapPinIcon,
  SearchIcon,
  TagIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/motion/fade-in"

const POPULAR_TAGS = [
  "Tecnología de la Información",
  "Marketing y Publicidad",
  "Diseño y Multimedia",
  "Administración y Finanzas",
]

interface HeroProps {
  categories: { name: string; slug: string }[]
}

function Hero({ categories }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-8 lg:py-12">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-6">
        <FadeIn>
          <div className="flex flex-wrap overflow-hidden rounded-md shadow-[0_0_20px_rgba(0,0,0,0.09)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            {/* Left: search panel */}
            <div className="w-full bg-card p-6 sm:p-10 lg:w-auto lg:flex-1">
              <h1 className="text-[28px] leading-[36px] font-normal text-balance text-foreground sm:text-[38px] sm:leading-[50px]">
                Encuentra el trabajo ideal
              </h1>
              <p className="mt-2 max-w-md text-base font-light text-muted-foreground sm:text-lg">
                Explora miles de oportunidades laborales y conecta con las
                mejores empresas.
              </p>

              <form
                action="/empleos"
                method="get"
                className="mt-7 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap"
              >
                <div className="flex h-14 min-w-[170px] flex-1 basis-0 items-center rounded bg-muted px-5">
                  <Input
                    name="q"
                    placeholder="Puesto o palabra clave"
                    className="h-full w-full border-none bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex h-14 min-w-[170px] flex-1 basis-0 items-center gap-2 rounded bg-muted px-5">
                  <Input
                    name="location"
                    placeholder="Ubicación"
                    className="h-full w-full border-none bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
                  />
                  <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <div className="flex h-14 min-w-[170px] flex-1 basis-0 items-stretch rounded bg-muted px-5">
                  <Select name="category">
                    <SelectTrigger
                      style={{ height: "100%" }}
                      className="h-full w-full justify-between border-none bg-transparent p-0 text-[15px] shadow-none"
                    >
                      <SelectValue
                        placeholder="Categoría"
                        className="w-full flex-1"
                      >
                        {(value: string) => value || "Categoría"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="h-14 w-full justify-center gap-2 rounded px-7 text-base font-medium transition-transform active:scale-[0.98] sm:w-auto"
                >
                  <SearchIcon className="size-4" />
                  Buscar
                </Button>
              </form>

              <p className="mt-4 text-sm text-muted-foreground">
                ¿Necesitas más opciones?{" "}
                <Link
                  href="/empleos"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Búsqueda avanzada
                </Link>
              </p>
            </div>

            {/* Right: post a job panel */}
            <div className="flex w-full flex-col justify-center gap-3 bg-muted/70 p-6 sm:p-10 lg:w-[300px] lg:shrink-0">
              <h2 className="text-xl font-medium text-foreground sm:text-[22px]">
                Publica una vacante y contrata talento
              </h2>
              <p className="text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                Estamos listos para ayudarte a alcanzar tus metas de
                contratación.
              </p>
              <Button
                className="w-fit gap-2 rounded bg-card px-5 text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-card/80"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Comenzar
              </Button>
            </div>

            {/* Featured categories banner */}
            <div className="flex w-full flex-wrap items-center justify-center gap-2 bg-[color:var(--chart-3)] px-4 py-3">
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/empleos?category=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
                >
                  <TagIcon className="size-3.5" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 400"
        fill="none"
      >
        <path
          d="M0,320 C240,380 480,260 720,280 C960,300 1200,380 1440,320 L1440,400 L0,400 Z"
          className="fill-primary/[0.12]"
        />
        <path
          d="M0,350 C300,300 600,400 900,340 C1100,300 1300,360 1440,340 L1440,400 L0,400 Z"
          className="fill-[color:var(--chart-3)]/[0.14]"
        />
      </svg>
      <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-10 -left-20 size-64 rounded-full bg-[color:var(--chart-3)]/15 blur-3xl" />
    </div>
  )
}

export { Hero }
