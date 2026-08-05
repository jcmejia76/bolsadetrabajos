"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import * as notificationService from "@/services/notification/notification.service";

export async function markNotificationReadAction(notificationId: string): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");
    await notificationService.markNotificationAsRead(session.user.id, notificationId);
    revalidatePath("/", "layout");
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user) return actionError("No autorizado");
    await notificationService.markAllNotificationsAsRead(session.user.id);
    revalidatePath("/", "layout");
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
