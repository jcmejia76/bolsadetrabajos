import { randomBytes } from "node:crypto";

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function generateSlugCandidate(title: string): string {
  return `${slugify(title)}-${randomBytes(4).toString("hex")}`;
}
