import { headers } from "next/headers";

/** Best-effort requester IP/user-agent for audit log entries. */
export async function getRequestMeta() {
  const h = await headers();
  const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
  const userAgent = h.get("user-agent") ?? undefined;
  return { ipAddress, userAgent };
}
