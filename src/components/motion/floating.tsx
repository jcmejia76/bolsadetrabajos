"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FloatProps {
  children: ReactNode
  className?: string
  /** Vertical travel distance in px. */
  distance?: number
  duration?: number
  delay?: number
}

/** Continuous gentle up/down float, for decorative hero cards. Combine with an entrance wrapper (FadeIn) for the initial reveal. */
function Float({ children, className, distance = 8, duration = 3.5, delay = 0 }: FloatProps) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { Float }
