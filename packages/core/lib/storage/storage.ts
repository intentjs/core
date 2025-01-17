import { Injectable } from '@nestjs/common';
import { LocalDiskOptions, S3DiskOptions, StorageDriver } from './interfaces';
import { StorageService } from './service';

@Injectable()
export class Storage {
  static build(config: S3DiskOptions | LocalDiskOptions): StorageDriver {
    return StorageService.makeDriver(config);
  }

  static disk(disk?: string) {
    return StorageService.getDriver(disk);
  }
}
