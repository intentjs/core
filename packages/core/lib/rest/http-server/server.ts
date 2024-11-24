import HyperExpress from 'hyper-express';
import { HttpMethods, HttpRoute } from './interfaces';
import { HttpStatus } from '@nestjs/common';
import './request-ext';

export class HyperServer {
  protected hyper: HyperExpress.Server;

  constructor() {}

  async build(
    routes: HttpRoute[],
    config: HyperExpress.ServerConstructorOptions,
  ): Promise<HyperExpress.Server> {
    this.hyper = new HyperExpress.Server(config || {});

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
}
