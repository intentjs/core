import { ConfigService, Injectable, IntentMiddleware } from '@intentjs/core';
import { MiddlewareNext, Request, Response } from 'hyper-express';

@Injectable()
export class GlobalMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    console.log('inside global middleware');
    next();
  }
}
