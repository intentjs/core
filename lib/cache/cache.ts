import { CacheDriver } from './interfaces';
import { CacheService } from './service';
import { genKeyFromObj } from './utils/genKey';

export class Cache {
  static store(store?: string): CacheDriver {
    const options = CacheService.data;
    return CacheService.stores[store || options.default];
  }

  static genKey(obj: Record<string, any>): string {
    return genKeyFromObj(obj);
  }
}

export function CacheKeyGen(obj: Record<string, any>): string {
  return genKeyFromObj(obj);
}

export function CacheStore(store?: string): CacheDriver {
  const options = CacheService.data;
  return CacheService.stores[store || options.default];
}
