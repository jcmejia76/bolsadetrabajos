"use client"

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react"

const STORAGE_KEY = "bdt-accessibility-prefs"

export interface AccessibilityPrefs {
  fontScale: number
  highContrast: boolean
  grayscale: boolean
  invertColors: boolean
  highlightLinks: boolean
  lineSpacing: boolean
  letterSpacing: boolean
  reduceMotion: boolean
  /**
   * Slot for a future dyslexia-friendly font. Kept as a real preference (so
   * it persists and shows up in the panel) but the toggle itself is disabled
   * in the UI until an actual font is wired into `--a11y-font-family` — see
   * AccessibilityWidget.
   */
  dyslexiaFont: boolean
}

export const DEFAULT_ACCESSIBILITY_PREFS: AccessibilityPrefs = {
  fontScale: 1,
  highContrast: false,
  grayscale: false,
  invertColors: false,
  highlightLinks: false,
  lineSpacing: false,
  letterSpacing: false,
  reduceMotion: false,
  dyslexiaFont: false,
}

export const FONT_SCALE_MIN = 0.85
export const FONT_SCALE_MAX = 2
export const FONT_SCALE_STEP = 0.15

function applyToDocument(prefs: AccessibilityPrefs) {
  const root = document.documentElement
  root.style.setProperty("--a11y-font-scale", String(prefs.fontScale))
  root.toggleAttribute("data-a11y-high-contrast", prefs.highContrast)
  root.toggleAttribute("data-a11y-highlight-links", prefs.highlightLinks)
  root.toggleAttribute("data-a11y-line-spacing", prefs.lineSpacing)
  root.toggleAttribute("data-a11y-letter-spacing", prefs.letterSpacing)
  root.toggleAttribute("data-a11y-reduce-motion", prefs.reduceMotion)

  // grayscale/invert/contrast are combined here (not via separate CSS rules)
  // because the `filter` property doesn't accumulate across cascaded rules —
  // the last one to apply would silently cancel the others.
  const filters: string[] = []
  if (prefs.grayscale) filters.push("grayscale(1)")
  if (prefs.invertColors) filters.push("invert(1) hue-rotate(180deg)")
  if (prefs.highContrast) filters.push("contrast(1.3)")
  root.style.filter = filters.join(" ")
}

/**
 * Tiny external store (read via useSyncExternalStore below) instead of
 * useState+useEffect — this is the one-mutable-source-of-truth pattern React
 * actually recommends for syncing with an external system like localStorage,
 * and it sidesteps any SSR/hydration mismatch since getServerSnapshot always
 * returns the same defaults the server rendered.
 */
function createPrefsStore() {
  let state = DEFAULT_ACCESSIBILITY_PREFS;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = { ...DEFAULT_ACCESSIBILITY_PREFS, ...JSON.parse(raw) };
    } catch {
      // Malformed or inaccessible storage — fall back to defaults silently.
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private browsing, quota) — prefs just won't persist.
    }
  }

  return {
    getSnapshot() {
      load();
      return state;
    },
    getServerSnapshot() {
      return DEFAULT_ACCESSIBILITY_PREFS;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(updater: (prev: AccessibilityPrefs) => AccessibilityPrefs) {
      load();
      state = updater(state);
      persist();
      applyToDocument(state);
      listeners.forEach((listener) => listener());
    },
  };
}

const prefsStore = createPrefsStore();

interface AccessibilityContextValue {
  prefs: AccessibilityPrefs
  setPref: <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => void
  increaseFontScale: () => void
  decreaseFontScale: () => void
  reset: () => void
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

function AccessibilityProvider({ children }: { children: ReactNode }) {
  const prefs = useSyncExternalStore(
    prefsStore.subscribe,
    prefsStore.getSnapshot,
    prefsStore.getServerSnapshot
  )

  // Deliberately depends on `prefs` (not just mount): useSyncExternalStore
  // renders with getServerSnapshot() during hydration and only swaps in the
  // real client snapshot via a follow-up re-render once hydration settles —
  // an empty-deps effect would capture the defaults from that first pass and
  // never see the corrected value.
  useEffect(() => {
    applyToDocument(prefs)
  }, [prefs])

  function setPref<K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) {
    prefsStore.update((p) => ({ ...p, [key]: value }))
  }

  function increaseFontScale() {
    prefsStore.update((p) => ({
      ...p,
      fontScale: Math.min(FONT_SCALE_MAX, Math.round((p.fontScale + FONT_SCALE_STEP) * 100) / 100),
    }))
  }

  function decreaseFontScale() {
    prefsStore.update((p) => ({
      ...p,
      fontScale: Math.max(FONT_SCALE_MIN, Math.round((p.fontScale - FONT_SCALE_STEP) * 100) / 100),
    }))
  }

  function reset() {
    prefsStore.update(() => DEFAULT_ACCESSIBILITY_PREFS)
  }

  return (
    <AccessibilityContext.Provider
      value={{ prefs, setPref, increaseFontScale, decreaseFontScale, reset }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error("useAccessibility debe usarse dentro de <AccessibilityProvider>")
  return ctx
}

export { AccessibilityProvider, useAccessibility }
