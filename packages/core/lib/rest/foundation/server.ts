import {
  DiscoveryService,
  MetadataScanner,
  ModuleRef,
  NestFactory,
} from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ConfigService } from '../../config/service';
import { IntentExceptionFilter } from '../../exceptions';
import { IntentAppContainer, ModuleBuilder } from '../../foundation';
import { Type } from '../../interfaces';
import { Obj, Package } from '../../utils';
import { Kernel } from '../foundation/kernel';
import pc from 'picocolors';
import { printBulletPoints } from '../../utils/console-helpers';
import 'console.mute';
import { Response as HyperResponse, Server } from 'hyper-express';
import {
  ExecutionContext,
  HttpExecutionContext,
  HyperServer,
  Request,
  Response,
  RouteExplorer,
} from '../http-server';
import { MiddlewareConfigurator } from './middlewares/configurator';
import { MiddlewareComposer } from './middlewares/middleware-composer';

const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

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
    const app = await NestFactory.createApplicationContext(module);

    const globalGuards = this.kernel.guards();

    const ds = app.get(DiscoveryService, { strict: false });
    const ms = app.get(MetadataScanner, { strict: false });
    const mr = app.get(ModuleRef, { strict: false });
    const errorHandler = await mr.create(this.errorHandler);
    const config = app.get(ConfigService, { strict: false });

    useContainer(app.select(module), { fallbackOnErrors: true });

    const middlewareConfigurator = new MiddlewareConfigurator();
    this.kernel.routeMiddlewares(middlewareConfigurator);

    const composer = new MiddlewareComposer(
      mr,
      middlewareConfigurator,
      this.kernel.middlewares(),
    );

    const globalMiddlewares = await composer.globalMiddlewares();
    const routeMiddlewares = await composer.getRouteMiddlewares();
    const excludedMiddlewares =
      await composer.getExcludedMiddlewaresForRoutes();

    const routeExplorer = new RouteExplorer(ds, ms, mr);
    const routes = await routeExplorer
      .useGlobalGuards(globalGuards)
      .useGlobalMiddlewares(globalMiddlewares)
      .useRouteMiddlewares(routeMiddlewares)
      .useExcludeMiddlewareRoutes(excludedMiddlewares)
      .exploreFullRoutes(errorHandler);

    const serverOptions = config.get('http.server');

    const customServer = new HyperServer();
    const server = await customServer.build(routes, serverOptions);

    server.set_error_handler((hReq: any, hRes: HyperResponse, error: Error) => {
      const res = new Response();
      const httpContext = new HttpExecutionContext(hReq, new Response());
      const context = new ExecutionContext(httpContext, null, null);
      errorHandler.catch(context, error);
      res.reply(hReq, hRes);
    });

    this.configureErrorReporter(config.get('app.sentry'));

    const port = config.get('app.port');
    const hostname = config.get('app.hostname');

    await this.container.boot(app);

    await server.listen(port, hostname || '0.0.0.0');

    for (const signal of signals) {
      process.on(signal, () => this.shutdown(server, signal));
    }

    this.printToConsole(config);
  }

  printToConsole(config: ConfigService<unknown>) {
    const port = config.get('app.port');
    const hostname = config.get('app.hostname');
    const environment = config.get('app.env');
    const debug = config.get('app.debug');

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

  async shutdown(server: Server, signal: string): Promise<void> {
    console.log(`\nReceived ${signal}, starting graceful shutdown...`);

    if (server) {
      await new Promise(res =>
        server.close(() => {
          res(1);
        }),
      );
    }
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
