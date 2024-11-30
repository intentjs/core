import cors, { CorsOptions } from 'cors';
import { IntentMiddleware, MiddlewareNext } from '../foundation';
import { ConfigService } from '../../config';
import { Injectable } from '@nestjs/common';
import { Request, Response } from '@intentjs/hyper-express';

@Injectable()
export class CorsMiddleware extends IntentMiddleware {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async use(req: Request, res: Response): Promise<void> {
    const corsOptions = this.config.get('http.cors') || ({} as CorsOptions);
    const corsMiddleware = cors(corsOptions);
    await new Promise(resolve => {
      corsMiddleware(req, res, () => {
        resolve(1);
      });
    });
  }
}
