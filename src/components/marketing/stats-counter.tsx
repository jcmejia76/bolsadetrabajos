import { Reveal } from "@/components/motion/reveal"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { platformStats } from "@/lib/mock/stats"

function StatsCounter() {
  return (
    <section className="bg-foreground py-16 text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {platformStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-background/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export { StatsCounter }
