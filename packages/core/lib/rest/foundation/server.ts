import {
  DiscoveryService,
  HttpAdapterHost,
  MetadataScanner,
  ModuleRef,
  NestFactory,
} from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { ConfigService } from '../../config/service';
import { IntentExceptionFilter } from '../../exceptions';
import {
  ContainerFactory,
  IntentAppContainer,
  ModuleBuilder,
} from '../../foundation';
import { Type } from '../../interfaces';
import { Obj, Package } from '../../utils';
import { Kernel } from '../foundation/kernel';
import { requestMiddleware } from '../middlewares/functional/requestSerializer';
import pc from 'picocolors';
import { printBulletPoints } from '../../utils/console-helpers';
import 'console.mute';
import { CustomServer } from './custom-server/explorer';
import { serve } from '@hono/node-server';

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

  async startCustomServer() {
    const module = ModuleBuilder.build(this.container, this.kernel);
    const app = await NestFactory.createApplicationContext(module);
    const ds = app.get(DiscoveryService, { strict: false });
    const ms = app.get(MetadataScanner, { strict: false });
    const mr = app.get(ModuleRef, { strict: false });

    const customServer = new CustomServer();
    const hono = await customServer.build(ds, ms, mr);
    const config = app.get(ConfigService, { strict: false });

    const port = config.get('app.port');
    const hostname = config.get('app.hostname');
    const environment = config.get('app.env');
    const debug = config.get('app.debug');

    serve({
      port,
      fetch: hono.fetch,
    });
  }

  async start() {
    // console['mute']();
    const module = ModuleBuilder.build(this.container, this.kernel);
    const app = await NestFactory.create<NestExpressApplication>(module, {
      bodyParser: true,
      logger: false,
    });

    if (this.errorHandler) {
      const { httpAdapter } = app.get(HttpAdapterHost);
      app.useGlobalFilters(new this.errorHandler(httpAdapter));
    }

    app.useBodyParser('json');
    app.useBodyParser('raw');
    app.useBodyParser('urlencoded');

    app.use(requestMiddleware);

    useContainer(app.select(module), { fallbackOnErrors: true });

    await this.container.boot(app);

    const config = app.get(ConfigService, { strict: false });

    this.configureErrorReporter(config.get('app.sentry'));

    const port = config.get('app.port');
    const hostname = config.get('app.hostname');
    const environment = config.get('app.env');
    const debug = config.get('app.debug');

    await app.listen(+port || 5001, hostname);

    // console['resume']();

    console.clear();

    console.log();

    printBulletPoints([
      ['➜', 'environment', environment],
      ['➜', 'debug', debug],
      ['➜', 'hostname', hostname],
      ['➜', 'port', port],
    ]);

    const url = new URL(
      ['127.0.0.1', '0.0.0.0'].includes(hostname)
        ? 'http://localhost'
        : `http://${hostname}`,
    );
    url.port = port;

    console.log();
    console.log(`  ${pc.white('Listening on')}: ${pc.cyan(url.toString())}`);
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
