import { FileSearchIcon, SendIcon, UserPlusIcon, WandSparklesIcon } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"

const STEPS = [
  {
    icon: UserPlusIcon,
    title: "Crea tu perfil",
    description:
      "Regístrate en minutos y arma un perfil que refleje tu experiencia real.",
  },
  {
    icon: FileSearchIcon,
    title: "Explora vacantes",
    description:
      "Filtra por ubicación, modalidad y salario para encontrar el ajuste ideal.",
  },
  {
    icon: SendIcon,
    title: "Aplica en segundos",
    description:
      "Envía tu CV con un clic y da seguimiento al estado de cada postulación.",
  },
  {
    icon: WandSparklesIcon,
    title: "Recibe una oferta",
    description:
      "Conecta directo con reclutadores y cierra tu próxima oportunidad.",
  },
] as const

function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Cómo funciona
        </h2>
        <p className="mt-3 text-muted-foreground">
          De cero a contratado en cuatro pasos simples.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <StaggerItem key={step.title} className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="size-5.5" />
              </span>
              <span className="text-3xl font-semibold text-border tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export { HowItWorks }
