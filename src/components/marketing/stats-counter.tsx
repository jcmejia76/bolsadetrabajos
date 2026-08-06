import { BriefcaseIcon, BuildingIcon, HandshakeIcon, UsersIcon } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { getPlatformStats } from "@/services/stats/platform-stats.service"

async function StatsCounter() {
  const stats = await getPlatformStats()

  const items = [
    { icon: BuildingIcon, label: "Empresas verificadas", value: stats.companies },
    { icon: BriefcaseIcon, label: "Vacantes activas", value: stats.jobs },
    { icon: UsersIcon, label: "Candidatos registrados", value: stats.candidates },
    { icon: HandshakeIcon, label: "Contrataciones realizadas", value: stats.hires },
  ] as const

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-[oklch(0.52_0.19_280)] to-[oklch(0.5_0.2_300)] py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-particles opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {items.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 text-white">
                <stat.icon className="size-5" />
              </span>
              <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.value > 0 ? "+" : ""} />
              </div>
              <p className="text-sm text-white/70">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export { StatsCounter }
