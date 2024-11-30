import { Response } from '@intentjs/hyper-express';
import { IntentExceptionFilter } from '../../exceptions/base-exception-handler';
import { IntentGuard } from '../foundation/guards/base-guard';
import { ExecutionContext } from './contexts/execution-context';
import { Reply } from './reply';
import { HttpStatus } from './status-codes';
import { StreamableFile } from './streamable-file';
import { isUndefined } from '../../utils/helpers';

export class HttpRouteHandler {
  constructor(
    protected readonly guards: IntentGuard[],
    protected readonly handler: Function,
    protected readonly exceptionFilter: IntentExceptionFilter,
  ) {}

  async handle(
    context: ExecutionContext,
    args: any[],
    replyHandler: Reply,
  ): Promise<Response> {
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
      }

      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      replyHandler.handle(request, response, responseFromHandler);
    } catch (e) {
      const res = this.exceptionFilter.catch(context, e);
      return res;
    }
  }
}
