"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function EmpresaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorState reset={reset} homeHref="/empresa" homeLabel="Ir al panel" />
}
