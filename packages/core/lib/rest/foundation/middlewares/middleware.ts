import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from '../../http-server';
import { MiddlewareNext } from 'hyper-express';

export abstract class IntentMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: MiddlewareNext): Promise<void> {
    await this.boot(req, res, next);
  }

  abstract boot(
    req: Request,
    res: Response,
    next: MiddlewareNext,
  ): void | Promise<void>;
}
