import { Request, Response } from '../../http-server';
import { MiddlewareNext } from 'hyper-express';

export abstract class IntentMiddleware {
  async handle(
    req: Request,
    res: Response,
    next: MiddlewareNext,
  ): Promise<void> {
    await this.use(req, res, next);
  }

  abstract use(
    req: Request,
    res: Response,
    next: MiddlewareNext,
  ): void | Promise<void>;
}
