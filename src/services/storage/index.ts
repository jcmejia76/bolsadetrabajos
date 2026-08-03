import type { StorageService } from "./storage-service";
import { LocalStorageService } from "./local-storage.service";

export type { StorageFolder, StorageService, UploadInput, UploadResult } from "./storage-service";
export { validateFile } from "./file-validation";

export function getStorageService(): StorageService {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  switch (driver) {
    case "local":
    default:
      return new LocalStorageService();
  }
}

/** Recovers the storage key (`folder/fileName`) from a stored fileUrl/photoUrl. */
export function keyFromUrl(url: string): string {
  return url.replace(/^\/(api\/files|uploads)\//, "");
}
