import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { ServerConstructorOptions } from '@intentjs/hyper-express';
import { GenericClass } from './utils';
import { WatchOptions } from 'fs-extra';

export interface SentryConfig {
  dsn: string;
  tracesSampleRate: number;
  profilesSampleRate: number;
  integrateNodeProfile: boolean;
}
export interface AppConfig {
  name: string;
  env: string;
  debug: boolean;
  url: string;
  hostname?: string;
  port: number;
  cors: CorsOptions | CorsOptionsDelegate<any>;
  error?: {
    validationErrorSerializer?: GenericClass;
  };
  sentry?: SentryConfig;
}

export type RequestParsers =
  | 'json'
  | 'urlencoded'
  | 'formdata'
  | 'plain'
  | 'html'
  | 'binary';

export interface HttpConfig {
  parsers: RequestParsers[];
  cors?: CorsOptions | CorsOptionsDelegate<any>;
  server?: ServerConstructorOptions;
  staticServe?: {
    httpPath?: string;
    filePath?: string;
    keep?: {
      extensions?: string[];
    };
    cache?: {
      max_file_count?: number;
      max_file_size?: number;
    };
  };
}
