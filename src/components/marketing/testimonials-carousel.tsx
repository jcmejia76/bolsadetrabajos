"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon, StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { MockTestimonial } from "@/lib/mock/testimonials"

interface TestimonialsCarouselProps {
  testimonials: MockTestimonial[]
}

function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    const card = track?.children[index] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    function onScroll() {
      if (!track) return
      const cards = Array.from(track.children) as HTMLElement[]
      const trackLeft = track.scrollLeft
      let closest = 0
      let closestDistance = Infinity
      cards.forEach((card, i) => {
        const distance = Math.abs(card.offsetLeft - track.offsetLeft - trackLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closest = i
        }
      })
      setActive(closest)
    }

    track.addEventListener("scroll", onScroll, { passive: true })
    return () => track.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex w-full shrink-0 snap-center flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            <div className="flex items-center justify-between">
              <QuoteIcon className="size-6 text-primary/40" />
              <div className="flex items-center gap-0.5 text-[color:var(--chart-4)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-3.5 fill-current" />
                ))}
              </div>
            </div>
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
        ))}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Testimonio anterior"
            onClick={() => scrollToIndex(Math.max(0, active - 1))}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
            disabled={active === 0}
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <button
                key={testimonial.id}
                type="button"
                aria-label={`Ir al testimonio ${i + 1}`}
                aria-current={active === i}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  active === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Siguiente testimonio"
            onClick={() => scrollToIndex(Math.min(testimonials.length - 1, active + 1))}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
            disabled={active === testimonials.length - 1}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export { TestimonialsCarousel }
