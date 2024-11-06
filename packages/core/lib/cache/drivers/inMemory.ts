import { GenericFunction } from '../../interfaces';
import { Package } from '../../utils/packageLoader';
import { CacheDriver, InMemoryDriverOption } from '../interfaces';

export class InMemoryDriver implements CacheDriver {
  private client: any;

  constructor(private options: InMemoryDriverOption) {
    const NodeCache = Package.load('node-cache');

    this.client = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }

  async get<T>(key: string): Promise<T> {
    const cacheKey = `${this.options.prefix}:::${key}`;
    return this.client.get(cacheKey);
  }

  async set(
    key: string,
    value: string | Record<string, any>,
    ttlInSec?: number | undefined,
  ): Promise<boolean> {
    const cacheKey = `${this.options.prefix}:::${key}`;

    if (ttlInSec) {
      return this.client.set(cacheKey, value, ttlInSec);
    }

    return this.client.set(cacheKey, value);
  }

  async has(key: string): Promise<boolean> {
    const cacheKey = `${this.options.prefix}:::${key}`;
    return this.client.has(cacheKey);
  }

  async remember<T = any>(
    key: string,
    cb: GenericFunction,
    ttlInSec: number,
  ): Promise<T> {
    const exists = await this.has(key);
    if (exists) return this.get(key);

    try {
      const response = await cb();
      await this.set(key, response, ttlInSec);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async rememberForever<T = any>(key: string, cb: GenericFunction): Promise<T> {
    const exists = await this.has(key);
    if (exists) return this.get(key);

    try {
      const response = await cb();
      await this.set(key, response);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async forget(key: string): Promise<boolean> {
    try {
      const cacheKey = `${this.options.prefix}:::${key}`;
      await this.client.del(cacheKey);
      return true;
    } catch {
      return false;
    }
  }

  getClient<T>(): T {
    return this.client as unknown as T;
  }
}
