import { ModuleMetadata, Type } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisDriverOption extends RedisOptions {
  driver: 'redis';
  prefix: string;
}

export interface InMemoryDriverOption {
  driver: 'memory';
  prefix: string;
}

export interface CacheOptions {
  isGlobal?: boolean;
  default: string;
  stores: {
    [key: string]: RedisDriverOption | InMemoryDriverOption;
  };
}

export interface CacheAsyncOptionsFactory {
  createCacheOptions(): Promise<CacheOptions> | CacheOptions;
}

export interface CacheAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal: boolean;
  useExisting?: Type<CacheOptions>;
  useClass?: Type<CacheAsyncOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<CacheOptions> | CacheOptions;
  inject?: any[];
}
