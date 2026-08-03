"use client"

import { useState } from "react"
import { BookmarkIcon, SendIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface JobDetailActionsProps {
  jobTitle: string
  className?: string
  fullWidth?: boolean
}

function JobDetailActions({
  jobTitle,
  className,
  fullWidth,
}: JobDetailActionsProps) {
  const [saved, setSaved] = useState(false)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        size="lg"
        className={cn("gap-2", fullWidth && "flex-1")}
        onClick={() =>
          toast.success("¡Función en camino!", {
            description: `Pronto podrás aplicar a "${jobTitle}" directamente desde aquí.`,
          })
        }
      >
        <SendIcon />
        Aplicar ahora
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-pressed={saved}
        aria-label={saved ? "Quitar de guardados" : "Guardar empleo"}
        onClick={() => {
          setSaved((v) => !v)
          toast(saved ? "Empleo removido de guardados" : "Empleo guardado")
        }}
        className={cn(saved && "border-primary/40 text-primary")}
      >
        <BookmarkIcon className={cn(saved && "fill-current")} />
      </Button>
    </div>
  )
}

export { JobDetailActions }
