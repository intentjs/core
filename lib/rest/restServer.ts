import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { ServerOptions } from "./interfaces";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IntentConfig } from "../config/service";
import { requestMiddleware } from "./middlewares/requestSerializer";
import { Obj, Package } from "../utils";

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

    const config = app.get(IntentConfig, { strict: false });

    if (config.get("errors")) {
      this.configureErrorReporter(config.get("errors"));
    }

    if (options.exceptionFilter) {
      const { httpAdapter } = app.get(HttpAdapterHost);
      app.useGlobalFilters(options.exceptionFilter(httpAdapter));
    }

    options?.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    await app.listen(options?.port || config.get<number>("app.port"));
  }

  static configureErrorReporter(config: Record<string, any>) {
    if (!config) return;

    if (Obj.isObj(config.sentry)) {
      const {
        dsn,
        tracesSampleRate,
        integrateNodeProfile,
        profilesSampleRate,
      } = config.sentry;

      if (dsn) {
        const Sentry = Package.load("@sentry/node");
        const integrations = [];
        /**
         * Load integrations
         */
        if (integrateNodeProfile) {
          const { nodeProfilingIntegration } = Package.load(
            "@sentry/profiling-node"
          );

          integrations.push(nodeProfilingIntegration());
        }

        Sentry.init({
          dsn,
          tracesSampleRate,
          profilesSampleRate,
          integrations,
        });
      }
    }
  }
}
