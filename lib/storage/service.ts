import { Injectable, Type } from '@nestjs/common';
import { ConfigService } from '../config/service';
import { logTime } from '../utils/helpers';
import { InternalLogger } from '../utils/logger';
import { Local, S3Storage } from './drivers';
import { DiskNotFoundException } from './exceptions/diskNotFound';
import {
  LocalDiskOptions,
  S3DiskOptions,
  StorageOptions,
  StorageDriver,
} from './interfaces';

@Injectable()
export class StorageService {
  private static readonly driverMap: Record<string, Type<StorageDriver>> = {
    local: Local,
    s3: S3Storage,
  };

  private static disks: { [key: string]: any };
  private static options: StorageOptions;

  constructor(private config: ConfigService) {
    StorageService.options = this.config.get('filesystem') as StorageOptions;
    const disksConfig = StorageService.options.disks;
    StorageService.disks = {};
    for (const diskName in StorageService.options.disks) {
      const time = Date.now();
      const diskConfig = disksConfig[diskName];
      const driver = StorageService.driverMap[diskConfig.driver];
      if (!driver) {
        InternalLogger.error(
          'StorageService',
          `We couldn't find any disk driver associated with the [${diskName}].`,
        );
        continue;
      }

      StorageService.disks[diskName] = new driver(diskName, diskConfig);
      InternalLogger.success(
        'StorageService',
        `Disk [${diskName}] successfully initiailized ${logTime(
          Date.now() - time,
        )}`,
      );
    }
  }

  static buildDriver(config: S3DiskOptions | LocalDiskOptions): StorageDriver {
    const driver = StorageService.driverMap[config.driver];
    if (!driver) throw new DiskNotFoundException(config);
    return new driver('', config);
  }

  static getDriver(disk?: string): StorageDriver {
    disk = disk || this.options.default;
    if (StorageService.disks[disk]) {
      return StorageService.disks[disk];
    }
    throw new DiskNotFoundException({ disk });
  }
}
