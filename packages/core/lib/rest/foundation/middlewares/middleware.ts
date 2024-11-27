import { MiddlewareNext, Request, Response } from 'hyper-express';

export abstract class IntentMiddleware {
  abstract use(
    req: Request,
    res: Response,
    next: MiddlewareNext,
  ): void | Promise<void>;
}
