import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisDriver } from './drivers/redis';
import {
  CacheDriver,
  InMemoryDriverOption,
  RedisDriverOption,
} from './interfaces';
import { CacheMetadata } from './metadata';
import { InMemoryDriver } from './drivers/inMemory';

@Injectable()
export class CacheService implements OnModuleInit {
  static stores: Record<string, CacheDriver>;

  onModuleInit() {
    const { stores } = CacheMetadata.getData();
    CacheService.stores = {};
    for (const store in stores) {
      if (stores[store].driver === 'redis') {
        CacheService.stores[store] = new RedisDriver(
          stores[store] as RedisDriverOption,
        );
      } else if (stores[store].driver === 'memory') {
        CacheService.stores[store] = new InMemoryDriver(
          stores[store] as InMemoryDriverOption,
        );
      }
    }
  }
}
