import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { ServerConstructorOptions } from '@intentjs/hyper-express';
import { GenericClass } from './utils';

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
}
