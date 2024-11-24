import {
  IntentMiddleware,
  MiddlewareNext,
  Request,
  Response,
} from '@intentjs/core';

export class GlobalMiddleware extends IntentMiddleware {
  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    console.log('inside global middleware');
    next();
  }
}
