"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  LockIcon,
  LogOutIcon,
  MapPinIcon,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface NavbarCategory {
  name: string
  slug: string
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
    <Link href="/" className="flex h-11 shrink-0 items-center gap-2.5">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BriefcaseBusinessIcon className="size-5.5" />
      </span>
      <span className="text-[18px] font-semibold tracking-tight text-foreground">
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

const noopSubscribe = () => () => {}

/** Avoids a hydration mismatch on `theme` (undefined on the server) without a
 * useEffect+setState mount flag, which retriggers a render on every mount. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
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
    "flex items-center gap-1 rounded-md px-[13px] py-[8px] text-[15px] font-normal text-foreground/70 transition-colors duration-150 hover:text-primary",
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
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md px-[13px] py-[8px] text-[15px] font-normal text-foreground/70 transition-colors duration-150 hover:text-primary",
          open && "text-primary"
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-[15px] py-2.5">
          <span className="text-sm text-neutral-400">Activar modo noche azul</span>
          <Switch
            checked={mounted && theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
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

function HeaderSearchForm({
  categories,
  className,
}: {
  categories: NavbarCategory[]
  className?: string
}) {
  return (
    <form
      action="/empleos"
      method="get"
      className={cn(
        "flex items-center gap-1 rounded-2xl border border-border bg-muted/60 p-1.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-shadow focus-within:border-primary/30 focus-within:shadow-[0_4px_18px_rgba(37,99,235,0.10)]",
        className
      )}
    >
      <div className="flex h-11 flex-1 items-center gap-2.5 rounded-xl px-3.5">
        <SearchIcon className="size-4.5 shrink-0 text-muted-foreground" />
        <Input
          name="q"
          placeholder="Puesto o palabra clave"
          className="h-full w-full border-none bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="hidden h-6 w-px bg-border sm:block" />
      <div className="hidden h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3.5 sm:flex">
        <MapPinIcon className="size-4.5 shrink-0 text-muted-foreground" />
        <Input
          name="location"
          placeholder="Ubicación"
          className="h-full w-full border-none bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
        />
      </div>
      <Select name="category">
        <SelectTrigger className="hidden h-11 w-[190px] shrink-0 justify-between rounded-xl border-none bg-transparent px-3.5 text-[15px] shadow-none lg:flex">
          <SelectValue placeholder="Categorías">
            {(value: string) => value || "Categorías"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="submit"
        className="h-11 shrink-0 gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[oklch(0.5_0.19_265)] px-5 shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] hover:brightness-105"
      >
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </form>
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

function Navbar({ user, categories }: { user: NavbarUser | null; categories: NavbarCategory[] }) {
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
        "sticky top-0 z-40 w-full border-b bg-background/75 backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "border-border shadow-[0_2px_20px_rgba(15,23,42,0.08)]"
          : "border-transparent shadow-none"
      )}
    >
      <div className="grid h-[83px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Logo />
        </div>

        <HeaderSearchForm
          categories={categories}
          className="hidden w-full max-w-4xl md:flex"
        />

        <div className="flex items-center justify-end gap-4">
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
            <HeaderSearchForm categories={categories} className="mb-4 flex md:hidden" />
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
      </div>

      <div className="hidden border-t border-border lg:block">
        <nav className="flex h-[51px] items-center justify-center px-4 sm:px-6 lg:px-8">
          {NAV_ITEMS.map((item) => (
            <NavDropdownItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </header>
  )
}

export { Navbar }
