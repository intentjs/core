import { Injectable } from '@nestjs/common';
import { InMemoryDriver } from './drivers/inMemory';
import { RedisDriver } from './drivers/redis';
import {
  CacheDriver,
  InMemoryDriverOption,
  RedisDriverOption,
} from './interfaces';
import { DiceDbDriver } from './drivers/dice-db';

@Injectable()
export class CacheService {
  static driverMap = {
    redis: RedisDriver,
    memory: InMemoryDriver,
    dicedb: DiceDbDriver,
  };
  static stores = new Map<string, CacheDriver>();

  constructor() {}

  static createStore(
    store: string,
    options?: RedisDriverOption | InMemoryDriverOption,
  ) {
    /**
     * Check if the store has already been cached.
     * If yes, then return the same cache driver.
     * Else, create a new driver.
     */
    if (this.stores.has(store)) return this.stores.get(store);

    const { driver: driverName } = options;
    const storeDriver = CacheService.driverMap[driverName];
    this.stores.set(store, new storeDriver(options as any));
    return this.stores.get(store);
  }
}
