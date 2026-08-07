import Link from "next/link"
import { BriefcaseBusinessIcon } from "lucide-react"

export function AuthLogo({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <Link href="/" className="relative z-10 flex items-center gap-2">
      {logoUrl ? (
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Bolsa de Trabajos" className="size-full object-contain" />
        </span>
      ) : (
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BriefcaseBusinessIcon className="size-4.5" />
        </span>
      )}
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Bolsa de Trabajos
      </span>
    </Link>
  )
}
