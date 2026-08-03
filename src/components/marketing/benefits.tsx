import {
  BadgeCheckIcon,
  BellRingIcon,
  RadarIcon,
  ZapIcon,
} from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"

const BENEFITS = [
  {
    icon: BadgeCheckIcon,
    title: "Vacantes verificadas",
    description:
      "Cada oferta pasa por un proceso de revisión antes de publicarse.",
  },
  {
    icon: ZapIcon,
    title: "Aplica en segundos",
    description: "Un solo perfil, un CV y postulaciones con un clic.",
  },
  {
    icon: BellRingIcon,
    title: "Alertas personalizadas",
    description:
      "Recibe notificaciones cuando aparezca una vacante que te interesa.",
  },
  {
    icon: RadarIcon,
    title: "Seguimiento en tiempo real",
    description:
      "Sigue el estado de cada postulación desde tu propio dashboard.",
  },
] as const

function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Por qué elegirnos
        </h2>
        <p className="mt-3 text-muted-foreground">
          Todo lo que necesitas para encontrar tu próximo empleo, sin
          fricción.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <StaggerItem key={benefit.title}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <benefit.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export { Benefits }
