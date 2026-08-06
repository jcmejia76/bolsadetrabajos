"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  x?: number
  className?: string
}

function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 16,
  x = 0,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { FadeIn }
