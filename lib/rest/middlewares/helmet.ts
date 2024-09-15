import { NextFunction } from 'express';
import helmet from 'helmet';
import { IntentConfig } from '../../config/service';
import { Injectable } from '../../foundation';
import { IntentMiddleware, Request, Response } from '../foundation';

@Injectable()
export class HelmetMiddleware extends IntentMiddleware {
  constructor(private readonly config: IntentConfig) {
    super();
  }

  boot(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    helmet(this.config.get('app.cors'));
    next();
  }
}
