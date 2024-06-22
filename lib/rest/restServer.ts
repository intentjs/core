import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { ServerOptions } from "./interfaces";
import { ExceptionFilter } from "../exceptions";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IntentConfig } from "../config/service";
import { requestMiddleware } from "./middlewares/requestSerializer";
import { ResponseSerializerInterceptor } from "./interceptors/response";

export class RestServer {
  private module: any;
  private options: ServerOptions;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(module: any, options?: ServerOptions): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(module);

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    app.enableCors({ origin: true });
    app.use(requestMiddleware);
    app.useGlobalInterceptors(new ResponseSerializerInterceptor());

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    options?.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    const config = app.get(IntentConfig, { strict: false });
    console.log("port ===> ", config.get("app.port"));

    await app.listen(options?.port || config.get<number>("app.port"));
  }
}
