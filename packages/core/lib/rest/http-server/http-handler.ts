import { IntentExceptionFilter } from '../../exceptions';
import { IntentGuard, IntentMiddleware } from '../foundation';
import { ExecutionContext } from './contexts/execution-context';
import { RouteArgType, RouteParamtypes } from './param-decorators';
import { Response } from './response';

export class HttpRouteHandler {
  constructor(
    protected readonly middlewares: IntentMiddleware[],
    protected readonly guards: IntentGuard[],
    protected readonly handler: Function,
    protected readonly exceptionFilter: IntentExceptionFilter,
  ) {}

  async handle(context: ExecutionContext): Promise<[any, Response]> {
    // for (const middleware of this.middlewares) {
    //   await middleware.use({}, {});
    // }

    try {
      /**
       * Handle the Guards
       */
      for (const guard of this.guards) {
        await guard.handle(context);
      }

      /**
       * Handle the request
       */
      const responseFromHandler = await this.handler;

      if (responseFromHandler instanceof Response) {
        return [, responseFromHandler];
      } else {
        const response = context.switchToHttp().getResponse();
        response.body(responseFromHandler);
        return [, response];
      }
    } catch (e) {
      const res = this.exceptionFilter.catch(context, e);
      return [undefined, res];
    }
  }
}
