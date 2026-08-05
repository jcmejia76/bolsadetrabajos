"use client"

import {
  AccessibilityIcon,
  ContrastIcon,
  LinkIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  RotateCcwIcon,
  SparklesIcon,
  TypeIcon,
  WavesIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  useAccessibility,
  type AccessibilityPrefs,
} from "@/components/accessibility/accessibility-provider"

interface ToggleRowProps {
  id: string
  icon: React.ReactNode
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  hint?: string
}

function ToggleRow({ id, icon, label, checked, onCheckedChange, disabled, hint }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <Label htmlFor={id} className="flex flex-1 items-center gap-2.5 text-sm font-normal">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </span>
        <span className="flex flex-col">
          {label}
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </span>
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}

function AccessibilityWidget() {
  const { prefs, setPref, increaseFontScale, decreaseFontScale, reset } = useAccessibility()

  function setBool<K extends keyof AccessibilityPrefs>(key: K) {
    return (value: boolean) => setPref(key, value as AccessibilityPrefs[K])
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              size="icon-lg"
              className="rounded-full shadow-lg"
              aria-label="Abrir opciones de accesibilidad"
            />
          }
        >
          <AccessibilityIcon className="size-5" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          className="w-80 max-h-[70vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between gap-2 pb-2">
            <p className="text-sm font-semibold text-foreground">Accesibilidad</p>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={reset}
            >
              <RotateCcwIcon className="size-3.5" />
              Restaurar
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border py-3">
            <Label htmlFor="a11y-font-scale" className="flex items-center gap-2.5 text-sm font-normal">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <TypeIcon className="size-4" />
              </span>
              Tamaño de texto
            </Label>
            <div id="a11y-font-scale" className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Disminuir tamaño de texto"
                onClick={decreaseFontScale}
                disabled={prefs.fontScale <= FONT_SCALE_MIN}
              >
                <MinusIcon className="size-3.5" />
              </Button>
              <span className="w-11 text-center text-xs tabular-nums text-muted-foreground">
                {Math.round(prefs.fontScale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Aumentar tamaño de texto"
                onClick={increaseFontScale}
                disabled={prefs.fontScale >= FONT_SCALE_MAX}
              >
                <PlusIcon className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-border border-t border-border">
            <ToggleRow
              id="a11y-high-contrast"
              icon={<ContrastIcon className="size-4" />}
              label="Alto contraste"
              checked={prefs.highContrast}
              onCheckedChange={setBool("highContrast")}
            />
            <ToggleRow
              id="a11y-grayscale"
              icon={<MoonIcon className="size-4" />}
              label="Escala de grises"
              checked={prefs.grayscale}
              onCheckedChange={setBool("grayscale")}
            />
            <ToggleRow
              id="a11y-invert"
              icon={<SparklesIcon className="size-4" />}
              label="Invertir colores"
              checked={prefs.invertColors}
              onCheckedChange={setBool("invertColors")}
            />
            <ToggleRow
              id="a11y-highlight-links"
              icon={<LinkIcon className="size-4" />}
              label="Resaltar enlaces"
              checked={prefs.highlightLinks}
              onCheckedChange={setBool("highlightLinks")}
            />
            <ToggleRow
              id="a11y-line-spacing"
              icon={<WavesIcon className="size-4" />}
              label="Espaciado entre líneas"
              checked={prefs.lineSpacing}
              onCheckedChange={setBool("lineSpacing")}
            />
            <ToggleRow
              id="a11y-letter-spacing"
              icon={<TypeIcon className="size-4" />}
              label="Espaciado entre letras"
              checked={prefs.letterSpacing}
              onCheckedChange={setBool("letterSpacing")}
            />
            <ToggleRow
              id="a11y-reduce-motion"
              icon={<AccessibilityIcon className="size-4" />}
              label="Ocultar animaciones"
              checked={prefs.reduceMotion}
              onCheckedChange={setBool("reduceMotion")}
            />
            <ToggleRow
              id="a11y-dyslexia-font"
              icon={<TypeIcon className="size-4" />}
              label="Fuente para dislexia"
              hint="Próximamente"
              checked={prefs.dyslexiaFont}
              onCheckedChange={setBool("dyslexiaFont")}
              disabled
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { AccessibilityWidget }
