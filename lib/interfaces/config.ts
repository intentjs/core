import {
  CorsOptions,
  CorsOptionsDelegate,
} from "@nestjs/common/interfaces/external/cors-options.interface";

export interface AppConfig {
  name: string;
  env: string;
  debug: boolean;
  url: string;
  port: number;
  cors: CorsOptions | CorsOptionsDelegate<any>;
}
