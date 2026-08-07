"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-utils";
import { actionOk, actionError, errorMessage, type ActionResult } from "@/lib/action-result";
import { createContentPageSchema, updateContentPageSchema } from "@/validations/content-page.schema";
import * as contentPageService from "@/services/content/content-page.service";
import { logAudit } from "@/services/audit/audit.service";
import { getRequestMeta } from "@/lib/request-meta";

function revalidateContent(slug?: string) {
  revalidatePath("/admin/contenido");
  if (slug) revalidatePath(`/${slug}`);
}

export async function createContentPageAction(
  input: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = createContentPageSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const page = await contentPageService.createContentPage(parsed.data, userId);

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "CREATE_CONTENT_PAGE",
      entityType: "ContentPage",
      entityId: page.id,
      after: { slug: page.slug, title: page.title },
      ipAddress,
      userAgent,
    });

    revalidateContent(page.slug);
    return actionOk({ id: page.id, slug: page.slug });
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function updateContentPageAction(id: string, input: unknown): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const parsed = updateContentPageSchema.safeParse(input);
    if (!parsed.success) return actionError(parsed.error.issues[0]?.message ?? "Datos inválidos");

    const page = await contentPageService.updateContentPage(id, parsed.data, userId);

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "UPDATE_CONTENT_PAGE",
      entityType: "ContentPage",
      entityId: id,
      after: { title: parsed.data.title },
      ipAddress,
      userAgent,
    });

    revalidateContent(page.slug);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}

export async function deleteContentPageAction(id: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await requireAdminSession();
    const page = await contentPageService.getContentPageForAdmin(id);
    await contentPageService.deleteContentPage(id);

    const { ipAddress, userAgent } = await getRequestMeta();
    await logAudit({
      actorId: userId,
      action: "DELETE_CONTENT_PAGE",
      entityType: "ContentPage",
      entityId: id,
      before: page ? { slug: page.slug, title: page.title } : undefined,
      ipAddress,
      userAgent,
    });

    revalidateContent(page?.slug);
    return actionOk(null);
  } catch (e) {
    return actionError(errorMessage(e));
  }
}
