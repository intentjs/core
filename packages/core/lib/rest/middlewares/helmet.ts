import helmet from 'helmet';
import { Injectable } from '../../foundation';
import { IntentMiddleware, MiddlewareNext } from '../foundation';
import { ConfigService } from '../../config';
import { Request, Response } from 'hyper-express';

@Injectable()
export class HelmetMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    helmet(this.config.get('app.helmet') as any);
    next();
  }
}
