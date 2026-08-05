/**
 * Fixed palette so avatar colors stay legible against white text, deliberately
 * distinct from the primary brand blue so a company avatar never gets mistaken
 * for a UI accent.
 */
const AVATAR_PALETTE = [
  "oklch(0.6 0.16 25)",
  "oklch(0.62 0.15 70)",
  "oklch(0.6 0.14 145)",
  "oklch(0.58 0.13 195)",
  "oklch(0.56 0.17 258)",
  "oklch(0.58 0.18 300)",
  "oklch(0.6 0.19 340)",
  "oklch(0.55 0.12 30)",
] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Computed once at company-creation time and persisted, so a company's avatar stays stable even if it later renames itself. */
export function deriveCompanyBranding(name: string): { color: string; initials: string } {
  const color = AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length];
  return { color, initials: deriveInitials(name) };
}
