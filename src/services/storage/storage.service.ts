export type StorageFolder = "cvs" | "avatars" | "logos" | "site";

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder: StorageFolder;
}

export interface UploadResult {
  key: string;
  url: string;
  sizeBytes: number;
}

export interface StorageService {
  upload(input: UploadInput): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
