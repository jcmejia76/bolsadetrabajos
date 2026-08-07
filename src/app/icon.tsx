import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSiteBranding } from "@/services/settings/site-settings.service";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export default async function Icon() {
  const { faviconUrl } = await getSiteBranding();

  const filePath = faviconUrl
    ? path.join(process.cwd(), "public", faviconUrl.replace(/^\//, ""))
    : path.join(process.cwd(), "src", "app", "favicon.ico");

  const buffer = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();

  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": CONTENT_TYPES[ext] ?? "image/png" },
  });
}
