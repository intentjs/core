import { Type } from '../interfaces';
import { Local } from './drivers/local';
import { S3Storage } from './drivers/s3Storage';
import { StorageDriver } from './interfaces';

export const DriverMap: Record<string, Type<StorageDriver>> = {
  local: Local,
  s3: S3Storage,
};
