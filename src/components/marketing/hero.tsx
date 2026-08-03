"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Briefcase,
  Building2,
  CheckCircle2,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  Users,
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
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { heroStats } from "@/lib/mock/stats"
import { mockCategories } from "@/lib/mock/categories"

const STAT_ICONS = [Building2, Briefcase, Users, CheckCircle2]

const POPULAR_TAGS = ["Tecnología", "Marketing", "Diseño", "Finanzas"]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 size-[32rem] rounded-full bg-primary/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-32 size-96 rounded-full bg-[color:var(--chart-3)]/15 blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="flex flex-col gap-7">
          <FadeIn>
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
              <SparklesIcon className="size-3.5 text-primary" />
              La forma más rápida de encontrar tu próximo empleo
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="text-display text-balance font-semibold text-foreground">
              Encuentra el trabajo que{" "}
              <span className="text-primary">impulsa tu carrera</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="max-w-lg text-lg text-muted-foreground">
              Miles de empresas confían en nosotros para encontrar talento.
              Explora vacantes verificadas, aplica en segundos y da
              seguimiento a cada postulación desde un solo lugar.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <form
              action="/empleos"
              method="get"
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg shadow-foreground/[0.03]"
            >
              <div className="relative flex items-center gap-2 rounded-xl bg-muted/60 px-3">
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Puesto o palabra clave"
                  className="h-11 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <div className="relative flex items-center gap-2 rounded-xl bg-muted/60 px-3">
                  <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    name="location"
                    placeholder="Ubicación"
                    className="h-11 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Select name="category">
                  <SelectTrigger className="h-11 w-full justify-between rounded-xl border-none bg-muted/60 px-3 shadow-none">
                    <SelectValue placeholder="Categoría">
                      {(value: string) => value || "Categoría"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.slug} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="h-11 gap-2 px-6">
                  <SearchIcon />
                  Buscar
                </Button>
              </div>
            </form>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Populares:</span>
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/empleos?category=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-border px-3 py-1 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="relative hidden lg:block">
          <IllustrationPanel />
        </div>
      </div>

      <div className="relative mx-auto -mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:hidden">
        <StatRow />
      </div>
    </section>
  )
}

function StatRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {heroStats.map((stat, i) => {
        const Icon = STAT_ICONS[i]
        return (
          <FadeIn key={stat.label} delay={0.1 + i * 0.06}>
            <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Icon className="size-4 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          </FadeIn>
        )
      })}
    </div>
  )
}

const FLOAT_POSITIONS = [
  { className: "top-6 left-0", duration: 6, delay: 0 },
  { className: "top-2 right-2", duration: 6.5, delay: 0.3 },
  { className: "bottom-24 left-4", duration: 5.5, delay: 0.6 },
  { className: "bottom-4 right-0", duration: 7, delay: 0.9 },
] as const

function IllustrationPanel() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-[color:var(--chart-3)]/10 to-transparent ring-1 ring-border" />

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 flex w-52 -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          NT
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Senior Frontend Engineer
          </span>
          <span className="text-xs text-muted-foreground">
            Nimbus Tech · Híbrido
          </span>
        </div>
      </motion.div>

      {heroStats.map((stat, i) => {
        const Icon = STAT_ICONS[i]
        const pos = FLOAT_POSITIONS[i]
        return (
          <motion.div
            key={stat.label}
            animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
            className={`absolute ${pos.className} w-40 rounded-xl border border-border bg-card p-3 shadow-xl`}
          >
            <Icon className="size-4 text-primary" />
            <div className="mt-1.5 text-lg font-semibold text-foreground">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[11px] text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export { Hero }
