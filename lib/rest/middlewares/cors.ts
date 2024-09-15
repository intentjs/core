import cors from 'cors';
import { NextFunction } from 'express';
import { IntentConfig } from '../../config/service';
import { Injectable } from '../../foundation';
import { IntentMiddleware, Request, Response } from '../foundation';

@Injectable()
export class CorsMiddleware extends IntentMiddleware {
  constructor(private readonly config: IntentConfig) {
    super();
  }

  boot(req: Request, res: Response, next: NextFunction): void | Promise<void> {
    cors(this.config.get('app.cors'));
    next();
  }
}
