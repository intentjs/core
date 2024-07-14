import { LocalDiskOptions, S3DiskOptions, StorageDriver } from "./interfaces";
import { StorageService } from "./service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Storage {
  static build(config: S3DiskOptions | LocalDiskOptions): StorageDriver {
    return StorageService.buildDriver(config);
  }

  static disk(disk?: string) {
    return StorageService.getDriver(disk);
  }
}
