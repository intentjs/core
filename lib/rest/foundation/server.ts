import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import 'console.mute';
import { IntentConfig } from '../../config/service';
import { IntentExceptionFilter } from '../../exceptions';
import { IntentAppContainer, ModuleBuilder } from '../../foundation';
import { Type } from '../../interfaces';
import { Obj, Package } from '../../utils';
import { Kernel } from '../foundation/kernel';
import { requestMiddleware } from '../middlewares/functional/requestSerializer';

export class IntentHttpServer {
  private kernel: Kernel;
  private errorHandler: Type<IntentExceptionFilter>;
  private container: IntentAppContainer;

  static init() {
    return new IntentHttpServer();
  }

  useContainer(containerCls: Type<IntentAppContainer>): this {
    this.container = new containerCls();
    this.container.build();
    return this;
  }

  useKernel(kernelCls: Type<Kernel>): this {
    this.kernel = new kernelCls();
    return this;
  }

  handleErrorsWith(filter: Type<IntentExceptionFilter>): this {
    this.errorHandler = filter;
    return this;
  }

  async start() {
    const module = ModuleBuilder.build(this.container, this.kernel);

    // console['mute']();
    const app = await NestFactory.create<NestExpressApplication>(module, {
      bodyParser: true,
    });

    if (this.errorHandler) {
      const { httpAdapter } = app.get(HttpAdapterHost);
      app.useGlobalFilters(new this.errorHandler(httpAdapter));
    }

    app.useBodyParser('json');
    app.useBodyParser('raw');
    app.useBodyParser('urlencoded');

    // console['resume']();

    app.use(requestMiddleware);

    useContainer(app.select(module), { fallbackOnErrors: true });

    await this.container.boot(app);

    const config = app.get(IntentConfig, { strict: false });

    this.configureErrorReporter(config.get('app.sentry'));

    // options?.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    await app.listen(5006 || config.get<number>('app.port'));
  }

  configureErrorReporter(config: Record<string, any>) {
    if (!config) return;

    if (Obj.isObj(config) && config?.dsn) {
      const {
        dsn,
        tracesSampleRate,
        integrateNodeProfile,
        profilesSampleRate,
      } = config;

      if (dsn) {
        const Sentry = Package.load('@sentry/node');
        const integrations = [];
        /**
         * Load integrations
         */
        if (integrateNodeProfile) {
          const { nodeProfilingIntegration } = Package.load(
            '@sentry/profiling-node',
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
