"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, BriefcaseIcon, FileUpIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { BlurIn } from "@/components/motion/reveal"
import { Float } from "@/components/motion/floating"
import { AnimatedCounter } from "@/components/motion/animated-counter"

const POPULAR_TAGS = [
  "Tecnología de la Información",
  "Marketing y Publicidad",
  "Diseño y Multimedia",
  "Administración y Finanzas",
]

interface HeroCompany {
  name: string
  initials: string
  color: string
}

interface HeroProps {
  jobsCount: number
  candidatesCount: number
  companies: HeroCompany[]
}

function Hero({ jobsCount, candidatesCount, companies }: HeroProps) {
  const featuredCompany = companies[0]

  return (
    <section className="bg-hero-gradient relative flex min-h-[90vh] items-center overflow-hidden pt-8 pb-28">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-6">
        {/* Left: headline */}
        <div>
          <FadeIn y={12}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-3.5 py-1.5 text-xs font-semibold text-success-foreground shadow-[0_4px_14px_rgba(34,197,94,0.35)]">
              <BriefcaseIcon className="size-3.5" />
              <AnimatedCounter value={jobsCount} prefix="+" /> vacantes activas
            </span>
          </FadeIn>

          <BlurIn delay={0.08}>
            <h1 className="mt-5 text-[34px] leading-[1.1] font-semibold text-balance text-white sm:text-[46px] sm:leading-[1.08]">
              Encuentra el trabajo{" "}
              <span className="bg-gradient-to-r from-success to-emerald-300 bg-clip-text text-transparent">
                que impulsa tu futuro
              </span>
            </h1>
          </BlurIn>

          <FadeIn y={12} delay={0.16}>
            <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
              Explora oportunidades laborales reales y conecta directo con las
              empresas que están contratando hoy.
            </p>
          </FadeIn>

          <FadeIn y={12} delay={0.24}>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/empleos?category=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-white/80 backdrop-blur-sm transition-colors hover:border-success/40 hover:text-success"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn y={12} delay={0.32}>
            <Button
              size="lg"
              className="group mt-8 h-12 gap-2 rounded-xl bg-success px-7 text-[15px] text-success-foreground shadow-[0_8px_24px_rgba(34,197,94,0.35)] transition-all hover:-translate-y-0.5 hover:bg-success/90 hover:shadow-[0_12px_32px_rgba(34,197,94,0.45)]"
              render={<Link href="/empleos" />}
              nativeButton={false}
            >
              Explorar vacantes
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </FadeIn>
        </div>

        {/* Right: decorative panel with real stat cards */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <FadeIn x={24} y={0} delay={0.1}>
            <div className="absolute inset-8 rounded-full border border-dashed border-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative size-80 overflow-hidden rounded-full bg-gradient-to-br from-success/30 via-primary/20 to-white/10 p-3">
                <div className="relative size-full overflow-hidden rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
                  <Image
                    src="/images/hero-professional.jpg"
                    alt="Profesional sonriendo, lista para su próxima oportunidad laboral"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
              <span className="absolute right-6 bottom-10 size-3 rounded-full bg-success shadow-[0_0_16px_6px_rgba(34,197,94,0.5)]" />
            </div>
          </FadeIn>

          <div className="absolute top-2 left-0">
            <FadeIn delay={0.35}>
              <Float
                distance={7}
                duration={4}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon className="size-4.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">
                    <AnimatedCounter value={candidatesCount} suffix={candidatesCount > 0 ? "+" : ""} />
                  </p>
                  <p className="text-xs text-muted-foreground">Candidatos activos</p>
                </div>
              </Float>
            </FadeIn>
          </div>

          <div className="absolute bottom-0 left-4">
            <FadeIn delay={0.55}>
              <Float
                distance={6}
                duration={3.2}
                delay={0.4}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]">
                  <FileUpIcon className="size-4.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">Sube tu CV</p>
                  <p className="text-xs text-muted-foreground">Y atrae a los reclutadores</p>
                </div>
              </Float>
            </FadeIn>
          </div>

          {featuredCompany && (
            <div className="absolute right-0 bottom-24">
              <FadeIn delay={0.75}>
                <Float
                  distance={7}
                  duration={3.8}
                  delay={0.2}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: featuredCompany.color }}
                  >
                    {featuredCompany.initials}
                  </span>
                  <div className="leading-tight">
                    <p className="max-w-[140px] truncate text-sm font-semibold text-foreground">
                      {featuredCompany.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Está contratando</p>
                  </div>
                </Float>
              </FadeIn>
            </div>
          )}
        </div>
      </div>

      <HeroWave />
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-particles opacity-80" />
      <div className="absolute -top-32 -right-20 size-[420px] rounded-full bg-success/20 blur-[110px]" />
      <div className="absolute top-1/3 -left-24 size-72 rounded-full bg-primary/25 blur-[100px]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        fill="none"
      >
        <path
          d="M-100,150 C300,50 500,300 900,180 C1150,100 1300,220 1540,140"
          stroke="url(#hero-line-1)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-100,650 C250,750 550,550 850,680 C1150,800 1300,620 1540,700"
          stroke="url(#hero-line-2)"
          strokeWidth="1.5"
          fill="none"
        />
        <defs>
          <linearGradient id="hero-line-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-line-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--success)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--success)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function HeroWave() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
      <svg
        className="h-[90px] w-full sm:h-[120px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        fill="none"
      >
        <path
          d="M0,64 C240,110 480,20 720,40 C960,60 1200,110 1440,64 L1440,120 L0,120 Z"
          className="fill-background"
        />
      </svg>
    </div>
  )
}

export { Hero }
