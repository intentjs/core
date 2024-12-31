import HyperExpress, { MiddlewareHandler } from '@intentjs/hyper-express';
import { HttpMethods, HttpRoute } from './interfaces';
import { IntentMiddleware } from '../foundation/middlewares/middleware';
import { Validator } from '../../validator';
import { ConfigService } from '../../config';
import LiveDirectory from 'live-directory';
import { FileNotFoundException } from '../../exceptions/file-not-found-exception';
import { Str } from '../../utils';
import { joinRoute } from '../helpers';

export class HyperServer {
  protected hyper: HyperExpress.Server;
  globalMiddlewares: IntentMiddleware[] = [];
  routeMiddlewares: Map<string, IntentMiddleware[]>;
  excludedRouteMiddlewares: Map<string, string[]>;

  constructor() {}

  async build(
    routes: HttpRoute[],
    config: HyperExpress.ServerConstructorOptions,
  ): Promise<HyperExpress.Server> {
    this.hyper = new HyperExpress.Server(config || {});

    /**
     * process the body by default, so that it's available in all of the middleware, guards and controllers
     */
    this.hyper.use(async (req, res) => {
      req.setValidator(Validator);
      await req.processBody();
    });

    for (const middleware of this.globalMiddlewares) {
      this.hyper.use(middleware.use.bind(middleware));
    }

    for (const route of routes) {
      const { path, httpHandler } = route;

      const middlewares = this.composeMiddlewares(path, route.method);
      switch (route.method) {
        case HttpMethods.GET:
          this.hyper.get(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.POST:
          this.hyper.post(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.DELETE:
          this.hyper.delete(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.HEAD:
          this.hyper.head(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.PUT:
          this.hyper.put(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.PATCH:
          this.hyper.patch(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.OPTIONS:
          this.hyper.options(path, ...middlewares, httpHandler);
          break;

        case HttpMethods.ANY:
          this.hyper.any(path, ...middlewares, httpHandler);
          break;
      }
    }

    this.configureStaticServer();

    return this.hyper;
  }

  configureStaticServer() {
    const staticServeConfig = ConfigService.get('http.staticServe');
    if (!staticServeConfig.filePath || !staticServeConfig.httpPath) return;

    const liveAssets = new LiveDirectory(staticServeConfig.filePath, {
      static: true,
      ...staticServeConfig,
    });

    const httpPath = joinRoute(
      '/',
      staticServeConfig.httpPath.replace('*', ''),
      '/*',
    );

    this.hyper.get(httpPath, (req, res) => {
      const path = Str.replaceFirst(
        req.path.replace(joinRoute('/', staticServeConfig.httpPath), ''),
        '/',
        '',
      );

      const file = liveAssets.get(path);

      // Return a 404 if no asset/file exists on the derived path
      if (file === undefined) {
        throw new FileNotFoundException(`File at ${path} does not exist`);
      }

      const fileParts = file.path.split('.');
      const extension = fileParts[fileParts.length - 1];

      const content = file.content;
      if (content instanceof Buffer) {
        return res.type(extension).send(content);
      } else {
        return res.type(extension).stream(content);
      }
    });
  }

  composeMiddlewares(path: string, method: string): MiddlewareHandler[] {
    const methodBasedRouteKey = `${method}:${path}`;
    const routeKey = `*:${path}`;

    const middlewareInstances = [
      ...(this.routeMiddlewares.get(methodBasedRouteKey) || []),
      ...(this.routeMiddlewares.get(routeKey) || []),
    ];

    const middlewares = [];
    for (const middlewareInstance of middlewareInstances) {
      middlewares.push(middlewareInstance.use.bind(middlewareInstance));
    }

    return middlewares;
  }

  useGlobalMiddlewares(globalMiddlewares: IntentMiddleware[]): HyperServer {
    this.globalMiddlewares = globalMiddlewares;
    return this;
  }

  useExcludeMiddlewareRoutes(
    routeMiddlewares: Map<string, string[]>,
  ): HyperServer {
    this.excludedRouteMiddlewares = routeMiddlewares;
    return this;
  }

  useRouteMiddlewares(
    routeMiddlewares: Map<string, IntentMiddleware[]>,
  ): HyperServer {
    this.routeMiddlewares = routeMiddlewares;
    return this;
  }
}
