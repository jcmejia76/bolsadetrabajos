const ALLOWED_MIME = {
  cv: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  image: ["image/png", "image/jpeg", "image/webp"],
} as const;

type FileKind = keyof typeof ALLOWED_MIME;

export function validateFile(
  file: { mimeType: string; sizeBytes: number },
  kind: FileKind,
  maxSizeMB = Number(process.env.MAX_UPLOAD_SIZE_MB ?? 5)
) {
  if (!(ALLOWED_MIME[kind] as readonly string[]).includes(file.mimeType)) {
    throw new Error("Tipo de archivo no permitido");
  }
  if (file.sizeBytes > maxSizeMB * 1024 * 1024) {
    throw new Error("El archivo excede el tamaño máximo permitido");
  }
}
