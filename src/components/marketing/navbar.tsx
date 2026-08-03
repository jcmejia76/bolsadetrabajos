"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusinessIcon, MenuIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { href: "/empleos", label: "Empleos" },
  { href: "/empresas", label: "Empresas" },
  { href: "/#como-funciona", label: "Cómo funciona" },
] as const

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BriefcaseBusinessIcon className="size-4.5" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Bolsa de Trabajos
      </span>
    </Link>
  )
}

function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname()
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {NAV_LINKS.map((link) => {
        const isActive =
          !link.href.startsWith("/#") && pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isActive && "bg-accent text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300",
        scrolled
          ? "border-border/80 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60"
          : "bg-background"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks className="hidden lg:flex" />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
            Iniciar sesión
          </Button>
          <Button render={<Link href="/login" />} nativeButton={false}>
            Publicar empleo
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" />
            }
          >
            <MenuIcon />
            <span className="sr-only">Abrir menú</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {link.label}
                </SheetClose>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" render={<Link href="/login" />} nativeButton={false}>
                Iniciar sesión
              </Button>
              <Button render={<Link href="/login" />} nativeButton={false}>
                Publicar empleo
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Navbar }
