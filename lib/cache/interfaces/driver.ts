import { GenericFunction } from '@libs/quicksilver/interfaces';

export interface CacheDriver {
  /**
   * Return the value stored corresponding to the key
   * @param key
   */
  get(key: string): Promise<any>;

  /**
   * Store the value with the passed key
   * @param key
   * @param value
   * @param ttlInSec
   */
  set(
    key: string,
    value: Record<string, any> | string,
    ttlInSec?: number,
  ): Promise<void>;

  /**
   * Check for existence of a particular key
   * @param key
   */
  has(key: string): Promise<boolean>;

  remember<T>(key: string, cb: GenericFunction, ttlInSec: number): Promise<T>;

  rememberForever<T>(key: string, cb: GenericFunction): Promise<T>;

  forget(key: string): Promise<void>;

  getClient<T>(): T;
}
