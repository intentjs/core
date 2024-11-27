import { IntentExceptionFilter } from '../../exceptions/base-exception-handler';
import { IntentGuard } from '../foundation/guards/base-guard';
import { ExecutionContext } from './contexts/execution-context';
import { Response } from './response';

export class HttpRouteHandler {
  constructor(
    protected readonly guards: IntentGuard[],
    protected readonly handler: Function,
    protected readonly exceptionFilter: IntentExceptionFilter,
  ) {}

  async handle(context: ExecutionContext, args: any[]): Promise<Response> {
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
      const responseFromHandler = await this.handler(...args);

      if (responseFromHandler instanceof Response) {
        return responseFromHandler;
      } else {
        const response = context.switchToHttp().getResponse();
        response.body(responseFromHandler);
        return response;
      }
    } catch (e) {
      const res = this.exceptionFilter.catch(context, e);
      return res;
    }
  }
}
