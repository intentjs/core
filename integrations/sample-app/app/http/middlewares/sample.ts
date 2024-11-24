import {
  IntentMiddleware,
  MiddlewareNext,
  Request,
  Response,
} from '@intentjs/core';

export class SampleMiddleware extends IntentMiddleware {
  boot(
    req: Request,
    res: Response,
    next: MiddlewareNext,
  ): void | Promise<void> {
    console.log('inside middleware');
    next();
  }
}
