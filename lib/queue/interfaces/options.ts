import { ModuleMetadata, Type } from '@nestjs/common';
import { QueueDriver } from '@squareboat/nest-queue-strategy';

export interface QueueDriverOptions {
  driver: Type<QueueDriver>;
  [key: string]: string | number | Record<string, any>;
}

export interface QueueOptions {
  isGlobal?: boolean;
  default: string;
  connections: {
    [key: string]: QueueDriverOptions;
  };
}

export interface QueueAsyncOptionsFactory {
  createQueueOptions(): Promise<QueueOptions> | QueueOptions;
}

export interface QueueAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal: boolean;
  useExisting?: Type<QueueOptions>;
  useClass?: Type<QueueAsyncOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<QueueOptions> | QueueOptions;
  inject?: any[];
}

export interface ListenerOptions {
  sleep?: number;
  connection?: string;
  queue?: string;
  schedulerInterval?: number;
  logger?: boolean;
}
