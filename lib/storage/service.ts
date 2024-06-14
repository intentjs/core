import { Injectable } from '@nestjs/common';
import { StorageOptions } from './interfaces';
import { StorageDriver } from './interfaces';
import { DriverManager } from './driverManager';
import { IntentConfig } from '../config/service';

@Injectable()
export class StorageService {
  private static diskDrivers: { [key: string]: any };
  private static options: StorageOptions;
  private static driverManager: DriverManager;

  constructor(private config: IntentConfig) {
    StorageService.options = this.config.get('filesystem');
    StorageService.diskDrivers = {};
    StorageService.driverManager = new DriverManager();
  }

  static getDriver(disk?: string): StorageDriver {
    disk = disk || this.options.default;
    if (StorageService.diskDrivers[disk]) {
      return StorageService.diskDrivers[disk];
    }

    const driver = StorageService.newDriver(disk);
    StorageService.diskDrivers[disk] = driver;
    return driver;
  }

  static newDriver(disk: string): StorageDriver {
    return StorageService.driverManager.getDriver(
      disk,
      StorageService.options.disks[disk],
    );
  }
}
