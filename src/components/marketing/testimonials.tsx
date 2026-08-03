import { QuoteIcon } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { mockTestimonials } from "@/lib/mock/testimonials"

function Testimonials() {
  return (
    <section id="testimonios" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Historias reales
          </h2>
          <p className="mt-3 text-muted-foreground">
            Candidatos y empresas que ya encontraron el ajuste correcto.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {mockTestimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <QuoteIcon className="size-6 text-primary/40" />
                <p className="flex-1 text-[15px] leading-relaxed text-foreground">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.initials}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export { Testimonials }
