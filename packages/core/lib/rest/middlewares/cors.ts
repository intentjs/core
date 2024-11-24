import cors, { CorsOptions } from 'cors';
import { ConfigService } from '../../config/service';
import { Injectable } from '../../foundation';
import { IntentMiddleware, MiddlewareNext } from '../foundation';
import { Request, Response } from '../http-server';

@Injectable()
export class CorsMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  use(req: Request, res: Response, next: MiddlewareNext): void | Promise<void> {
    console.log(this.config.get('app.cors'));
    cors(this.config.get('app.cors') as CorsOptions);
    next();
  }
}
