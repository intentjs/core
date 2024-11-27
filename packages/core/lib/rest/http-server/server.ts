import HyperExpress from 'hyper-express';
import { HttpMethods, HttpRoute } from './interfaces';
import { requestMiddleware } from './request/middleware';
import { IntentMiddleware } from '../foundation/middlewares/middleware';

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
    this.hyper.use(requestMiddleware);

    this.hyper.use(async (hReq, res, next) => {
      for (const middleware of this.globalMiddlewares) {
        await middleware.handle(hReq, res, next);
      }
    });

    for (const route of routes) {
      const { path, httpHandler } = route;
      switch (route.method) {
        case HttpMethods.GET:
          this.hyper.get(path, httpHandler);
          break;

        case HttpMethods.POST:
          this.hyper.post(path, httpHandler);
          break;

        case HttpMethods.DELETE:
          this.hyper.delete(path, httpHandler);
          break;

        case HttpMethods.HEAD:
          this.hyper.head(path, httpHandler);
          break;

        case HttpMethods.PUT:
          this.hyper.put(path, httpHandler);
          break;

        case HttpMethods.PATCH:
          this.hyper.patch(path, httpHandler);
          break;

        case HttpMethods.OPTIONS:
          this.hyper.options(path, httpHandler);
          break;

        case HttpMethods.ANY:
          this.hyper.any(path, httpHandler);
          break;
      }
    }

    // this.hyper.set_not_found_handler((req: HyperExpress.Request, res: HyperExpress.Response) => {
    //   return res.status(HttpStatus.NOT_FOUND).type('text').send()
    // })
    return this.hyper;
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
