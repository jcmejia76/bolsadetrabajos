import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"

function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[0.25rem] bg-primary px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              ¿Listo para dar el siguiente paso en tu carrera?
            </h2>
            <p className="max-w-lg text-primary-foreground/80">
              Únete a miles de profesionales y empresas que ya confían en
              nuestra plataforma para crecer.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-6"
                render={<Link href="/empleos" />}
                nativeButton={false}
              >
                Buscar empleos
                <ArrowRightIcon className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-white/10"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Publicar una vacante
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export { CtaSection }
