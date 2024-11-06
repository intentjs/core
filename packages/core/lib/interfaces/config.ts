import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { GenericClass } from '.';

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
  port: number;
  cors: CorsOptions | CorsOptionsDelegate<any>;
  error?: {
    validationErrorSerializer?: GenericClass;
  };
  sentry?: SentryConfig;
}
