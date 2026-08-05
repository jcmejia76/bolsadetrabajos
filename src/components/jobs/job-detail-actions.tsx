"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BookmarkIcon, CheckIcon, SendIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { applyToJobAction } from "@/app/(marketing)/empleos/[slug]/actions"
import { toggleFavoriteAction } from "@/lib/actions/favorites"

interface JobDetailActionsProps {
  jobPostingId: string
  jobSlug: string
  jobTitle: string
  hasApplied: boolean
  initialSaved?: boolean
  className?: string
  fullWidth?: boolean
}

function JobDetailActions({
  jobPostingId,
  jobSlug,
  jobTitle,
  hasApplied,
  initialSaved = false,
  className,
  fullWidth,
}: JobDetailActionsProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const [isSavePending, startSaveTransition] = useTransition()

  function handleToggleSave() {
    const next = !saved
    setSaved(next)
    startSaveTransition(async () => {
      const result = await toggleFavoriteAction(jobPostingId)
      if (!result.success) {
        setSaved(!next)
        toast.error(result.error)
        return
      }
      toast(result.data.favorited ? "Empleo guardado" : "Empleo removido de guardados")
    })
  }

  function handleApply() {
    startTransition(async () => {
      const result = await applyToJobAction(jobPostingId, jobSlug)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("¡Postulación enviada!", {
        description: `Tu postulación a "${jobTitle}" fue enviada correctamente.`,
      })
      router.refresh()
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        size="lg"
        className={cn("gap-2", fullWidth && "flex-1")}
        onClick={handleApply}
        disabled={hasApplied || isPending}
      >
        {hasApplied ? <CheckIcon /> : <SendIcon />}
        {hasApplied ? "Ya te postulaste" : isPending ? "Enviando..." : "Aplicar ahora"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-pressed={saved}
        aria-label={saved ? "Quitar de guardados" : "Guardar empleo"}
        onClick={handleToggleSave}
        disabled={isSavePending}
        className={cn(saved && "border-primary/40 text-primary")}
      >
        <BookmarkIcon className={cn(saved && "fill-current")} />
      </Button>
    </div>
  )
}

export { JobDetailActions }
