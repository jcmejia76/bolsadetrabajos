"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  once?: boolean
  className?: string
}

function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 24,
  once = true,
  className,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

interface StaggerProps {
  children: ReactNode
  className?: string
  once?: boolean
}

function Stagger({ children, className, once = true }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

export { Reveal, Stagger, StaggerItem }
