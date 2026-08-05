"use client"

import Link from "next/link"
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

interface ErrorStateProps {
  reset: () => void
  homeHref?: string
  homeLabel?: string
}

function ErrorState({ reset, homeHref = "/", homeLabel = "Ir al inicio" }: ErrorStateProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <EmptyState
        icon={<AlertTriangleIcon />}
        title="Ocurrió un error inesperado"
        description="Algo salió mal al cargar esta página. Puedes intentar de nuevo o volver al inicio."
        className="max-w-lg border-none bg-transparent py-0"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcwIcon className="size-4" />
              Reintentar
            </Button>
            <Button render={<Link href={homeHref} />} nativeButton={false}>
              {homeLabel}
            </Button>
          </div>
        }
      />
    </div>
  )
}

export { ErrorState }
