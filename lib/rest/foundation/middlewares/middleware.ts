import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from '../interface';

export abstract class IntentMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.boot(req, res, next);
  }

  abstract boot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Promise<void>;
}
