import { Context } from 'hono';
import { IntentGuard } from '../guards/base-guard';
import { IntentMiddleware } from '../middlewares/middleware';
import { ExecutionContext } from './execution-context';

export class HttpRouteHandler {
  constructor(
    protected readonly middlewares: IntentMiddleware[],
    protected readonly guards: IntentGuard[],
    protected readonly handler: Function,
  ) {}

  async handle(context: ExecutionContext) {
    // for (const middleware of this.middlewares) {
    //   await middleware.use({}, {});
    // }

    /**
     * Handle the Guards
     */
    for (const guard of this.guards) {
      await guard.handle(context);
    }

    /**
     * Handle the request
     */
    const res = await this.handler(context);
    return res;
  }
}
