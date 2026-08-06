import { Reveal } from "@/components/motion/reveal"
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel"
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

        <Reveal>
          <TestimonialsCarousel testimonials={mockTestimonials} />
        </Reveal>
      </div>
    </section>
  )
}

export { Testimonials }
