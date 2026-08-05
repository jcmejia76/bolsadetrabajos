const ALLOWED_MIME = {
  cv: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  image: ["image/png", "image/jpeg", "image/webp"],
} as const;

const ALLOWED_EXTENSIONS: Record<FileKind, readonly string[]> = {
  cv: ["pdf", "doc", "docx"],
  image: ["png", "jpg", "jpeg", "webp"],
};

type FileKind = keyof typeof ALLOWED_MIME;

/**
 * Real content sniffers, keyed by the MIME type the caller/browser declared.
 * A declared `mimeType` is trivially spoofable (it's client-supplied), so we
 * verify the actual file bytes match a known signature for that type instead
 * of trusting the label.
 */
const MAGIC_BYTE_CHECKS: Record<string, (buf: Buffer) => boolean> = {
  "application/pdf": (buf) => buf.subarray(0, 4).toString("latin1") === "%PDF",
  "image/png": (buf) =>
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/jpeg": (buf) => buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
  "image/webp": (buf) =>
    buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP",
  // Legacy .doc — OLE compound file signature.
  "application/msword": (buf) =>
    buf.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  // .docx — ZIP container signature (PK\x03\x04).
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (buf) =>
    buf.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
};

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot + 1).toLowerCase();
}

export function validateFile(
  file: { mimeType: string; sizeBytes: number; buffer?: Buffer; originalName?: string },
  kind: FileKind,
  maxSizeMB = Number(process.env.MAX_UPLOAD_SIZE_MB ?? 5)
) {
  if (!(ALLOWED_MIME[kind] as readonly string[]).includes(file.mimeType)) {
    throw new Error("Tipo de archivo no permitido");
  }
  if (file.sizeBytes > maxSizeMB * 1024 * 1024) {
    throw new Error("El archivo excede el tamaño máximo permitido");
  }
  if (file.originalName) {
    const ext = extensionOf(file.originalName);
    if (!ALLOWED_EXTENSIONS[kind].includes(ext)) {
      throw new Error("Extensión de archivo no permitida");
    }
  }
  if (file.buffer) {
    const isValidContent = MAGIC_BYTE_CHECKS[file.mimeType]?.(file.buffer) ?? false;
    if (!isValidContent) {
      throw new Error("El contenido del archivo no coincide con el tipo declarado");
    }
  }
}
