import { IntentMiddleware, MiddlewareNext } from '@intentjs/core';
import { Request, Response } from '@intentjs/hyper-express';

export class SampleMiddleware extends IntentMiddleware {
  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    // console.log(req.isHttp(), req.httpHost(), req.all(), req.bearerToken());
    next();
  }
}
