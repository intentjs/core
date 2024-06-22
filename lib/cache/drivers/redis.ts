import IORedis from "ioredis";
import { CacheDriver, RedisDriverOption } from "../interfaces";
import { GenericFunction } from "../../interfaces";

export class RedisDriver implements CacheDriver {
  private client: IORedis;

  constructor(private options: RedisDriverOption) {
    this.client = new IORedis({ ...options });
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
    ttlInSec?: number
  ): Promise<void> {
    const redisKey = `${this.options.prefix}:::${key}`;
    if (ttlInSec) {
      await this.client.set(redisKey, JSON.stringify(value), "EX", ttlInSec);
      return;
    }

    await this.client.set(redisKey, JSON.stringify(value));
  }

  async has(key: string): Promise<boolean> {
    const num = await this.client.exists(`${this.options.prefix}:::${key}`);
    return !!num;
  }

  async remember<T>(
    key: string,
    cb: GenericFunction,
    ttlInSec: number
  ): Promise<T> {
    const value = await this.get(key);
    if (value) return value;
    const response = await cb();
    await this.set(key, response, ttlInSec);
    return response;
  }

  async rememberForever<T>(key: string, cb: GenericFunction): Promise<T> {
    const value = await this.get(key);
    if (value) return value;
    const response = await cb();
    await this.set(key, response);
    return response;
  }

  async forget(key: string): Promise<void> {
    try {
      await this.client.del(this.storeKey(key));
    } catch (e) {
      console.error("Error deleting key from redis", e);
    }
  }

  private storeKey(key: string): string {
    return `${this.options.prefix}:::${key}`;
  }

  getClient<T>(): T {
    return this.client as unknown as T;
  }
}
