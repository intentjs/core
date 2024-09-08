import { NextFunction } from 'express';
import { IntentConfig } from '../../config/service';
import { Injectable } from '../../providers';
import { Package } from '../../utils';
import { IntentMiddleware, Request, Response } from '../foundation';

@Injectable()
export class HelmetMiddleware extends IntentMiddleware {
  constructor(private readonly config: IntentConfig) {
    super();
  }

  boot(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    const helmet = Package.load('helmet');
    helmet(this.config.get('app.cors'));
    next();
  }
}
