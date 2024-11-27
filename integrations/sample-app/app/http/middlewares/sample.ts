import { IntentMiddleware, MiddlewareNext } from '@intentjs/core';
import { Request, Response } from 'hyper-express';

export class SampleMiddleware extends IntentMiddleware {
  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    console.log('inside middleware');
    next();
  }
}
