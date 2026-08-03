import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <EmptyState
        icon={<SearchXIcon />}
        title="No encontramos esta página"
        description="Puede que el enlace esté roto o que el contenido ya no exista. Vuelve al inicio o explora las vacantes disponibles."
        className="max-w-lg border-none bg-transparent py-0"
        action={
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
              Ir al inicio
            </Button>
            <Button render={<Link href="/empleos" />} nativeButton={false}>
              Ver empleos
            </Button>
          </div>
        }
      />
    </div>
  )
}
