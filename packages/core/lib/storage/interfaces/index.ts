export * from './storageDriver';
export * from './storageOptions';
export * from './fileOptions';

export interface StorageDriver$FileMetadataResponse {
  path?: string;
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
}

export type StorageDriver$GetFileResponse = Buffer | null;

export interface StorageDriver$PutFileResponse {
  path?: string;
  url?: string;
}

export interface StorageDriver$RenameFileResponse {
  path?: string;
  url?: string;
}
