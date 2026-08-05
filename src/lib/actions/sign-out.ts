"use server";

import { auth, signOut } from "@/auth";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

export async function signOutAction() {
  const session = await auth();
  if (session?.user) {
    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: session.user.id,
      action: "LOGOUT",
      entityType: "User",
      entityId: session.user.id,
      ipAddress,
      userAgent,
    });
  }
  await signOut({ redirectTo: "/login" });
}
