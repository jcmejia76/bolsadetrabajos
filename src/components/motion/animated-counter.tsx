"use client"

import { useEffect, useRef } from "react"
import { animate, useInView } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  formatter?: (value: number) => string
}

function AnimatedCounter({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    const node = ref.current
    if (!isInView || !node) return

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        const rounded = Math.round(latest)
        const formatted = formatter
          ? formatter(rounded)
          : rounded.toLocaleString("es")
        node.textContent = `${prefix}${formatted}${suffix}`
      },
    })

    return () => controls.stop()
  }, [isInView, value, duration, prefix, suffix, formatter])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}

export { AnimatedCounter }
