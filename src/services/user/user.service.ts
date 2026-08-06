import { prisma } from "@/lib/prisma";
import { getStorageService, validateFile, keyFromUrl } from "@/services/storage";
import type { PersonalProfileInput } from "@/validations/user.schema";

function emptyToNull(value: string | undefined | null): string | null {
  return value && value.trim() !== "" ? value : null;
}

export async function getUserPersonalProfile(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true, firstName: true, lastName: true, phone: true, aboutMe: true, photoUrl: true },
  });
}

export async function updateUserPersonalProfile(userId: string, input: PersonalProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName: emptyToNull(input.firstName),
      lastName: emptyToNull(input.lastName),
      phone: emptyToNull(input.phone),
      aboutMe: emptyToNull(input.aboutMe),
    },
  });
}

export async function updateUserPhoto(
  userId: string,
  file: { buffer: Buffer; originalName: string; mimeType: string }
) {
  validateFile(
    { mimeType: file.mimeType, sizeBytes: file.buffer.byteLength, buffer: file.buffer, originalName: file.originalName },
    "image",
    2
  );

  const existing = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const storage = getStorageService();
  const result = await storage.upload({ ...file, folder: "avatars" });

  await prisma.user.update({ where: { id: userId }, data: { photoUrl: result.url } });

  if (existing.photoUrl) {
    await storage.delete(keyFromUrl(existing.photoUrl)).catch(() => undefined);
  }

  return result.url;
}

export async function removeUserPhoto(userId: string) {
  const existing = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!existing.photoUrl) return;

  await prisma.user.update({ where: { id: userId }, data: { photoUrl: null } });
  await getStorageService()
    .delete(keyFromUrl(existing.photoUrl))
    .catch(() => undefined);
}
