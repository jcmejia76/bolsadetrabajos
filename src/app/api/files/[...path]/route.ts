import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

const LOCAL_ROOT = process.env.STORAGE_LOCAL_ROOT ?? "./storage";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  if (segments.length < 2) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }
  const [folder, fileName] = segments;
  const key = `${folder}/${fileName}`;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const authorized = await isAuthorized(session.user, folder, key);
  if (!authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), LOCAL_ROOT, folder, fileName);
  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const ext = path.extname(fileName).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}

async function isAuthorized(
  user: { role: Role; candidateId?: string; companyId?: string },
  folder: string,
  key: string
): Promise<boolean> {
  if (user.role === Role.ADMINISTRADOR) return true;

  const publicUrl = `/api/files/${key}`;

  if (folder === "cvs") {
    const cv = await prisma.cV.findFirst({ where: { fileUrl: publicUrl } });
    if (!cv) return false;
    if (cv.candidateId === user.candidateId) return true;
    if (user.role === Role.EMPRESA && user.companyId) {
      const application = await prisma.application.findFirst({
        where: { cvId: cv.id, jobPosting: { companyId: user.companyId } },
      });
      return !!application;
    }
    return false;
  }

  if (folder === "avatars") {
    const candidate = await prisma.candidate.findFirst({ where: { photoUrl: publicUrl } });
    return !!candidate && candidate.id === user.candidateId;
  }

  return false;
}
