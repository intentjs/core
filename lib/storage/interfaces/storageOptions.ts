export type StorageDiskType = 's3' | 'local';

export interface DiskOptions {
  driver: 's3' | 'local';
  profile?: string;
  region?: string;
  bucket?: string;
  prefix?: string;
  basePath?: string;
  accessKey?: string;
  secretKey?: string;
  fetchRemoteCredentials?: boolean;
}

export interface S3DiskOptions {
  driver: 's3';
  region: string;
  bucket: string;
  credentials?: any;
  accessKey?: string;
  secretKey?: string;
  basePath?: string;
  throwOnFailure?: boolean;
}

export interface LocalDiskOptions {
  driver: 'local';
  basePath?: string;
  throwOnFailure?: boolean;
}

export interface StorageOptions {
  default: string;
  disks: Record<string, LocalDiskOptions | S3DiskOptions>;
}
