import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function EmpresaNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <EmptyState
        icon={<SearchXIcon />}
        title="No encontramos esta página"
        description="Puede que el enlace esté roto o que el contenido ya no exista."
        className="max-w-lg border-none bg-transparent py-0"
        action={
          <Button render={<Link href="/empresa" />} nativeButton={false}>
            Ir al panel
          </Button>
        }
      />
    </div>
  )
}
