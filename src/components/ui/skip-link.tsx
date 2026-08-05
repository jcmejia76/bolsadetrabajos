function SkipLink({ href = "#main-content" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      Saltar al contenido
    </a>
  )
}

export { SkipLink }
