import { GenericFunction } from '../../interfaces';
import { Package } from '../../utils';
import { CacheDriver, RedisDriverOption } from '../interfaces';

export class RedisDriver implements CacheDriver {
  private client: any;

  constructor(private options: RedisDriverOption) {
    const IORedis = Package.load('ioredis');
    if (options.url) {
      this.client = new IORedis(options.url, { db: options.database || 0 });
    } else {
      this.client = new IORedis({
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        db: options.database,
      });
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(`${this.options.prefix}:::${key}`);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  async set(
    key: string,
    value: string | number | Record<string, any>,
    ttlInSec?: number,
  ): Promise<boolean> {
    try {
      const redisKey = `${this.options.prefix}:::${key}`;
      ttlInSec
        ? await this.client.set(redisKey, JSON.stringify(value), 'EX', ttlInSec)
        : await this.client.set(redisKey, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  async has(key: string): Promise<boolean> {
    const num = await this.client.exists(`${this.options.prefix}:::${key}`);
    return !!num;
  }

  async remember<T = any>(
    key: string,
    cb: GenericFunction,
    ttlInSec: number,
  ): Promise<T> {
    const value = await this.get(key);
    if (value) return value;
    const response = await cb();
    if (response) await this.set(key, response, ttlInSec);

    return response;
  }

  async rememberForever<T = any>(key: string, cb: GenericFunction): Promise<T> {
    const value = await this.get(key);
    if (value) return value;
    const response = await cb();
    if (response) await this.set(key, response);
    return response;
  }

  async forget(key: string): Promise<boolean> {
    try {
      await this.client.del(this.storeKey(key));
      return true;
    } catch (e) {
      return false;
    }
  }

  private storeKey(key: string): string {
    return `${this.options.prefix}:::${key}`;
  }

  getClient<T>(): T {
    return this.client as unknown as T;
  }
}
