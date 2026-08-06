import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BellRingIcon,
  BuildingIcon,
  CheckIcon,
  RadarIcon,
  ZapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { Stagger, StaggerItem } from "@/components/motion/reveal"

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

interface BenefitsProps {
  companiesCount: number
}

function Benefits({ companiesCount }: BenefitsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn x={-24} y={0} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <Image
              src="/images/benefits-remote-work.jpg"
              alt="Candidata revisando vacantes desde su computadora"
              fill
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-cover"
            />
          </div>
          {companiesCount > 0 && (
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/12 text-success">
                <BuildingIcon className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">
                  {companiesCount}+ empresas
                </p>
                <p className="text-xs text-muted-foreground">confían en la plataforma</p>
              </div>
            </div>
          )}
        </FadeIn>

        <div>
          <FadeIn x={24} y={0}>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Por qué elegirnos
            </h2>
            <p className="mt-3 text-muted-foreground">
              Todo lo que necesitas para encontrar tu próximo empleo, sin
              fricción.
            </p>
          </FadeIn>

          <Stagger className="mt-8 flex flex-col gap-2">
            {BENEFITS.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <div className="group flex items-start gap-4 rounded-xl p-2 transition-colors hover:bg-success/5">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-success/12 text-success transition-transform duration-300 group-hover:scale-110">
                    <CheckIcon className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn x={24} y={0} delay={0.2} className="mt-6">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-xl bg-success px-7 text-success-foreground shadow-[0_8px_24px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-0.5 hover:bg-success/90 hover:shadow-[0_12px_32px_rgba(34,197,94,0.4)]"
              render={<Link href="/empleos" />}
              nativeButton={false}
            >
              Explorar ahora
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export { Benefits }
