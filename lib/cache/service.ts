import { Injectable, OnModuleInit } from '@nestjs/common';
import { logTime } from '../utils/helpers';
import { InternalLogger } from '../utils/logger';
import { InMemoryDriver } from './drivers/inMemory';
import { RedisDriver } from './drivers/redis';
import { CacheDriver, CacheOptions } from './interfaces';
import { ConfigService } from '../config';

@Injectable()
export class CacheService implements OnModuleInit {
  static driverMap = { redis: RedisDriver, memory: InMemoryDriver };
  public static data: CacheOptions;
  static stores: Record<string, CacheDriver>;

  constructor(config: ConfigService) {
    CacheService.data = config.get('cache') as CacheOptions;
  }

  onModuleInit() {
    if (!CacheService.data) return;
    const { stores } = CacheService.data;
    CacheService.stores = {};
    for (const store in stores) {
      const time = Date.now();
      const driver = CacheService.driverMap[stores[store].driver];

      if (!driver) {
        InternalLogger.error(
          'QueueService',
          `We couldn't find any driver associated with the "${stores[store].driver}".`,
        );
        continue;
      }

      CacheService.stores[store] = new driver(stores[store] as never);
      InternalLogger.success(
        'CacheService',
        `Cache store [${
          stores[store].driver
        }] successfully initiailized ${logTime(Date.now() - time)}`,
      );
    }
  }
}
