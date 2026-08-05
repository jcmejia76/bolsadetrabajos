import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageFolder, StorageService, UploadInput, UploadResult } from "./storage.service";

const PRIVATE_FOLDERS: readonly StorageFolder[] = ["cvs", "avatars"];
const LOCAL_ROOT = process.env.STORAGE_LOCAL_ROOT ?? "./storage";
const PUBLIC_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export class LocalStorageService implements StorageService {
  async upload({ buffer, originalName, folder }: UploadInput): Promise<UploadResult> {
    const fileName = `${randomUUID()}-${sanitizeName(originalName)}`;
    const isPrivate = PRIVATE_FOLDERS.includes(folder);
    const baseDir = isPrivate ? path.join(process.cwd(), LOCAL_ROOT, folder) : path.join(PUBLIC_ROOT, folder);

    await mkdir(baseDir, { recursive: true });
    await writeFile(path.join(baseDir, fileName), buffer);

    const key = `${folder}/${fileName}`;
    return { key, url: this.getUrl(key), sizeBytes: buffer.byteLength };
  }

  async delete(key: string): Promise<void> {
    const [folder, fileName] = key.split("/");
    const isPrivate = PRIVATE_FOLDERS.includes(folder as StorageFolder);
    const filePath = isPrivate
      ? path.join(process.cwd(), LOCAL_ROOT, folder, fileName)
      : path.join(PUBLIC_ROOT, folder, fileName);
    await unlink(filePath).catch(() => undefined);
  }

  getUrl(key: string): string {
    const [folder] = key.split("/");
    const isPrivate = PRIVATE_FOLDERS.includes(folder as StorageFolder);
    return isPrivate ? `/api/files/${key}` : `/uploads/${key}`;
  }
}
