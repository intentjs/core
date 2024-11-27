import cors, { CorsOptions } from 'cors';
import { IntentMiddleware, MiddlewareNext } from '../foundation';
import { ConfigService } from '../../config';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'hyper-express';

@Injectable()
export class CorsMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async use(req: Request, res: Response, next: MiddlewareNext): Promise<void> {
    const corsMiddleware = cors(this.config.get('app.cors') as CorsOptions);
    await new Promise(resolve => {
      corsMiddleware(req, res, () => {
        resolve(1);
      });
    });

    next();
  }
}
