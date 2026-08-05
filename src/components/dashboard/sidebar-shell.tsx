"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusinessIcon, LogOutIcon, MenuIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOutAction } from "@/lib/actions/sign-out"
import { SkipLink } from "@/components/ui/skip-link"

export interface DashboardNavItem {
  href: string
  label: string
  icon: ReactNode
  exact?: boolean
}

interface SidebarShellProps {
  navItems: DashboardNavItem[]
  panelLabel: string
  userLabel?: string
  children: ReactNode
}

function isActiveHref(pathname: string, item: DashboardNavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href)
}

function NavLinks({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: DashboardNavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActiveHref(pathname, item)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function SignOutForm({ collapsedLabel = "Cerrar sesión" }: { collapsedLabel?: string }) {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
      >
        <LogOutIcon className="size-4" />
        {collapsedLabel}
      </Button>
    </form>
  )
}

function Brand() {
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

function SidebarShell({
  navItems,
  panelLabel,
  userLabel,
  children,
}: SidebarShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <SkipLink />
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        <div className="mb-6 px-1">
          <Brand />
        </div>
        <div className="mb-4 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {panelLabel}
        </div>
        <NavLinks navItems={navItems} pathname={pathname} />
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          {userLabel && (
            <p className="truncate px-3 text-xs text-muted-foreground">
              {userLabel}
            </p>
          )}
          <SignOutForm />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <MenuIcon />
              <span className="sr-only">Abrir menú</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <div className="mb-2 px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {panelLabel}
              </div>
              <NavLinks
                navItems={navItems}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                {userLabel && (
                  <p className="truncate px-3 text-xs text-muted-foreground">
                    {userLabel}
                  </p>
                )}
                <SignOutForm />
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold text-foreground">
            {panelLabel}
          </span>
        </header>

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export { SidebarShell }
