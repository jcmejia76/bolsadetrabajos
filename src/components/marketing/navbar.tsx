"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  LockIcon,
  LogOutIcon,
  UserPlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions/sign-out"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

interface NavChild {
  label: string
  href: string
}

interface NavbarUser {
  name?: string | null
  email?: string | null
  roleLabel: string
  quickLinks: NavChild[]
}

interface NavItem {
  label: string
  href?: string
  children?: NavChild[]
}

const TECH_CATEGORY = encodeURIComponent("Tecnología de la Información")
const DESIGN_CATEGORY = encodeURIComponent("Diseño y Multimedia")

const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    children: [
      { label: "Buscar vacantes", href: "/empleos" },
      { label: "Explorar empresas", href: "/empresas" },
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Testimonios", href: "/#testimonios" },
    ],
  },
  {
    label: "Empleos",
    href: "/empleos",
    children: [
      { label: "Todas las vacantes", href: "/empleos" },
      { label: "Tecnología", href: `/empleos?category=${TECH_CATEGORY}` },
      { label: "Diseño y Multimedia", href: `/empleos?category=${DESIGN_CATEGORY}` },
      { label: "Publicar una vacante", href: "/login" },
    ],
  },
  {
    label: "Empresas",
    href: "/empresas",
    children: [
      { label: "Explorar empresas", href: "/empresas" },
      { label: "Empresas verificadas", href: "/empresas" },
      { label: "Publicar tu empresa", href: "/login" },
    ],
  },
  {
    label: "Candidatos",
    href: "/candidato",
    children: [
      { label: "Panel de candidato", href: "/candidato" },
      { label: "Crear tu perfil", href: "/login" },
      { label: "Subir tu CV", href: "/login" },
      { label: "Empleos guardados", href: "/candidato/favoritos" },
    ],
  },
  {
    label: "Páginas",
    children: [
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Testimonios", href: "/#testimonios" },
      { label: "Preguntas frecuentes", href: "/#como-funciona" },
      { label: "Acceso administrador", href: "/login" },
    ],
  },
]

function Logo() {
  return (
    <Link href="/" className="flex h-10 shrink-0 items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BriefcaseBusinessIcon className="size-5" />
      </span>
      <span className="text-[16px] font-semibold tracking-tight text-foreground">
        Bolsa de Trabajos
      </span>
    </Link>
  )
}

function isItemActive(pathname: string, href?: string) {
  if (!href) return false
  if (href === "/") return pathname === "/"
  if (href.startsWith("/#")) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function useHoverDropdown() {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  return { open, handleEnter, handleLeave }
}

function NavDropdownItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const { open, handleEnter, handleLeave } = useHoverDropdown()
  const active = isItemActive(pathname, item.href)
  const triggerClassName = cn(
    "flex items-center gap-1 rounded-md px-[11px] py-[7px] text-sm font-normal text-foreground/70 transition-colors duration-150 hover:text-primary",
    (active || open) && "text-primary"
  )

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {item.href ? (
        <Link href={item.href} className={triggerClassName}>
          {item.label}
          {item.children && (
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}
        </Link>
      ) : (
        <button type="button" className={cn(triggerClassName, "cursor-default")}>
          {item.label}
          <ChevronDownIcon
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      )}

      {item.children && (
        <div
          className={cn(
            "absolute top-full left-0 z-50 min-w-[210px] origin-top rounded-[4px] bg-[#2c2c2e] py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all duration-[250ms] ease-out",
            open
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-1 opacity-0"
          )}
        >
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="block px-[15px] py-[6px] text-sm text-neutral-400 transition-colors duration-150 hover:text-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu({ user }: { user: NavbarUser }) {
  const { open, handleEnter, handleLeave } = useHoverDropdown()
  const displayName = user.name ?? user.email ?? "Cuenta"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md px-[11px] py-[7px] text-sm font-normal text-foreground/70 transition-colors duration-150 hover:text-primary",
          open && "text-primary"
        )}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initial}
        </span>
        <span className="max-w-[160px] truncate">{displayName}</span>
        <ChevronDownIcon
          className={cn("size-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "absolute top-full right-0 z-50 min-w-[240px] origin-top-right rounded-[4px] bg-[#2c2c2e] py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all duration-[250ms] ease-out",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        )}
      >
        <div className="border-b border-white/10 px-[15px] pb-2.5">
          <p className="truncate text-sm font-medium text-white">{displayName}</p>
          {user.email && user.email !== displayName && (
            <p className="truncate text-xs text-neutral-400">{user.email}</p>
          )}
          <p className="text-xs text-neutral-400">{user.roleLabel}</p>
        </div>
        <div className="py-1.5">
          {user.quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-[15px] py-[6px] text-sm text-neutral-400 transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-white/10 pt-1.5">
          <form action={signOutAction}>
            <button
              type="submit"
              className="block w-full px-[15px] py-[6px] text-left text-sm text-neutral-400 transition-colors duration-150 hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-4 shrink-0 flex-col items-center justify-center gap-[5px]">
      <span
        className={cn(
          "h-[1.5px] w-4.5 rounded-full bg-foreground transition-all duration-300",
          open && "translate-y-[6.5px] rotate-45"
        )}
      />
      <span
        className={cn(
          "h-[1.5px] w-4.5 rounded-full bg-foreground transition-all duration-300",
          open && "scale-x-0 opacity-0"
        )}
      />
      <span
        className={cn(
          "h-[1.5px] w-4.5 rounded-full bg-foreground transition-all duration-300",
          open && "-translate-y-[6.5px] -rotate-45"
        )}
      />
    </span>
  )
}

function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isItemActive(pathname, item.href)

  if (!item.children) {
    return (
      <SheetClose
        render={<Link href={item.href ?? "#"} />}
        className={cn(
          "block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          active && "text-primary"
        )}
      >
        {item.label}
      </SheetClose>
    )
  }

  return (
    <AccordionItem value={item.label} className="border-none">
      <AccordionTrigger
        className={cn(
          "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:no-underline hover:bg-accent",
          active && "text-primary"
        )}
      >
        {item.href ? (
          <SheetClose
            render={<Link href={item.href} />}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {item.label}
          </SheetClose>
        ) : (
          item.label
        )}
      </AccordionTrigger>
      <AccordionPanel className="pl-3">
        <div className="flex flex-col gap-1 border-l border-border pl-3">
          {item.children.map((child) => (
            <SheetClose
              key={child.label}
              render={<Link href={child.href} />}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {child.label}
            </SheetClose>
          ))}
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

function Navbar({ user }: { user: NavbarUser | null }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background transition-shadow duration-300",
        scrolled
          ? "shadow-[0_2px_20px_rgba(0,0,0,0.10)]"
          : "shadow-[0_0_18px_rgba(0,0,0,0.06)]"
      )}
    >
      <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavDropdownItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                <LockIcon className="size-3.5" />
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                <UserPlusIcon className="size-3.5" />
                Registrarse
              </Link>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              />
            }
          >
            <HamburgerIcon open={mobileOpen} />
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <Accordion className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem key={item.label} item={item} pathname={pathname} />
              ))}
            </Accordion>
            <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 px-3 pb-1">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.name ?? user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.roleLabel}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {user.quickLinks.map((link) => (
                      <SheetClose
                        key={link.href}
                        render={<Link href={link.href} />}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {link.label}
                      </SheetClose>
                    ))}
                  </div>
                  <form action={signOutAction} className="pt-1">
                    <Button type="submit" variant="outline" className="w-full">
                      <LogOutIcon className="size-4" />
                      Cerrar sesión
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button variant="outline" render={<Link href="/login" />} nativeButton={false}>
                    <LockIcon className="size-4" />
                    Iniciar sesión
                  </Button>
                  <Button render={<Link href="/registro" />} nativeButton={false}>
                    <UserPlusIcon className="size-4" />
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Navbar }
