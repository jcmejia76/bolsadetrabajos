import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { CreateContentPageInput, UpdateContentPageInput } from "@/validations/content-page.schema";

/** Single-segment routes already owned by the app — a content page can't reuse these slugs. */
const RESERVED_SLUGS = new Set([
  "empleos",
  "empresas",
  "soporte",
  "contacto",
  "admin",
  "candidato",
  "empresa",
  "login",
  "registro",
  "invitaciones",
  "unauthorized",
  "icon",
  "api",
]);

function isUniqueConstraintError(e: unknown, field: string): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2002" &&
    ((e.meta?.target as string[] | undefined)?.includes(field) ?? false)
  );
}

export async function listContentPages() {
  return prisma.contentPage.findMany({ orderBy: { title: "asc" } });
}

export async function getContentPageForAdmin(id: string) {
  return prisma.contentPage.findUnique({ where: { id } });
}

export async function getPublishedContentPageBySlug(slug: string) {
  return prisma.contentPage.findUnique({ where: { slug } });
}

export async function createContentPage(input: CreateContentPageInput, adminId: string) {
  if (RESERVED_SLUGS.has(input.slug)) {
    throw new Error(`El slug "${input.slug}" está reservado, elige otro`);
  }

  try {
    return await prisma.contentPage.create({
      data: {
        title: input.title,
        slug: input.slug,
        body: input.body,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        updatedById: adminId,
      },
    });
  } catch (e) {
    if (isUniqueConstraintError(e, "slug")) {
      throw new Error("Ya existe una página con ese slug");
    }
    throw e;
  }
}

export async function updateContentPage(id: string, input: UpdateContentPageInput, adminId: string) {
  return prisma.contentPage.update({
    where: { id },
    data: {
      title: input.title,
      body: input.body,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      updatedById: adminId,
    },
  });
}

export async function deleteContentPage(id: string) {
  await prisma.contentPage.delete({ where: { id } });
}
