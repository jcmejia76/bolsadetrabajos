import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, BriefcaseIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"

function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[oklch(0.52_0.19_275)] to-[oklch(0.48_0.2_290)] px-8 py-12 shadow-[0_20px_50px_rgba(37,99,235,0.25)] transition-transform duration-300 hover:-translate-y-1 sm:px-10">
            <Image
              src="/images/cta-candidate.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-20 mix-blend-luminosity"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/15 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
            />
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/15 text-primary-foreground backdrop-blur-sm">
              <SearchIcon className="size-6" />
            </span>
            <div className="relative flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-balance text-primary-foreground sm:text-3xl">
                ¿Buscas tu próximo empleo?
              </h2>
              <p className="max-w-sm text-primary-foreground/80">
                Crea tu perfil, sube tu CV y aplica a vacantes verificadas en
                segundos.
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="group/btn relative w-fit gap-2 rounded-xl px-6 shadow-lg transition-transform hover:-translate-y-0.5"
              render={<Link href="/empleos" />}
              nativeButton={false}
            >
              Buscar empleos
              <ArrowRightIcon className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111c3a] to-[#0b1220] px-8 py-12 shadow-[0_20px_50px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 sm:px-10">
            <Image
              src="/images/cta-employer.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-20 mix-blend-luminosity"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/90 to-[#0f172a]/65"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-success/20 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
            />
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
              <BriefcaseIcon className="size-6" />
            </span>
            <div className="relative flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-balance text-white sm:text-3xl">
                ¿Necesitas contratar talento?
              </h2>
              <p className="max-w-sm text-white/70">
                Publica tu vacante y llega a miles de candidatos calificados
                en toda la región.
              </p>
            </div>
            <Button
              size="lg"
              className="group/btn relative w-fit gap-2 rounded-xl bg-success px-6 text-success-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-success/90"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Publicar una vacante
              <ArrowRightIcon className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export { CtaSection }
