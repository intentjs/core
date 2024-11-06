import { NextFunction } from 'express';
import helmet from 'helmet';
import { Injectable } from '../../foundation';
import { IntentMiddleware, Request, Response } from '../foundation';
import { ConfigService } from '../../config';

@Injectable()
export class HelmetMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  boot(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    helmet(this.config.get('app.helmet') as any);
    next();
  }
}
