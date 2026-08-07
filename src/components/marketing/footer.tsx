"use client"

import type { SVGProps } from "react"
import Link from "next/link"
import { ArrowRightIcon, BriefcaseBusinessIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { openSupportChat } from "@/components/support/support-chat-widget"

function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z" />
    </svg>
  )
}

function XGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
    </svg>
  )
}

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.4h2.8l.4-3.3h-3.2V8.1c0-1 .3-1.6 1.7-1.6h1.7V3.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.3h2.8V22h3.3Z" />
    </svg>
  )
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const FOOTER_COLUMNS = [
  {
    title: "Para candidatos",
    links: [
      { href: "/empleos", label: "Buscar empleos" },
      { href: "/empresas", label: "Explorar empresas" },
      { href: "/registro", label: "Crear cuenta" },
    ],
  },
  {
    title: "Para empresas",
    links: [
      { href: "/registro?type=empresa", label: "Publicar una vacante" },
      { href: "/empresas", label: "Ver empresas" },
      { href: "/registro?type=empresa", label: "Planes y precios" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { href: "/#como-funciona", label: "Cómo funciona" },
      { href: "/#testimonios", label: "Testimonios" },
      { href: "/contacto", label: "Contacto" },
      { href: "#soporte-chat", label: "Soporte" },
    ],
  },
] as const

const SOCIALS = [
  { href: "#", icon: LinkedinGlyph, label: "LinkedIn" },
  { href: "#", icon: XGlyph, label: "X" },
  { href: "#", icon: FacebookGlyph, label: "Facebook" },
  { href: "#", icon: InstagramGlyph, label: "Instagram" },
] as const

function Footer({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-particles opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Bolsa de Trabajos" className="size-full object-contain" />
                </span>
              ) : (
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                  <BriefcaseBusinessIcon className="size-4.5" />
                </span>
              )}
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Bolsa de Trabajos
              </span>
            </Link>
            <p className="max-w-xs text-sm text-white/60">
              Conectamos talento excepcional con las empresas que están
              construyendo el futuro. Encuentra tu próximo empleo o al
              candidato ideal.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg text-white/60 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link, i) =>
                  link.href === "#soporte-chat" ? (
                    <li key={`${link.href}-${i}`}>
                      <button
                        type="button"
                        onClick={openSupportChat}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    </li>
                  ) : (
                    <li key={`${link.href}-${i}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">
              Mantente al día
            </h3>
            <p className="text-sm text-white/60">
              Recibe nuevas vacantes y noticias del mercado laboral cada
              semana.
            </p>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="tu@correo.com"
                className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary/50"
              />
              <Button type="submit" className="group w-full gap-1.5 rounded-lg">
                Suscribirme
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Bolsa de Trabajos. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/privacidad" className="hover:text-white">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white">
              Términos
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
