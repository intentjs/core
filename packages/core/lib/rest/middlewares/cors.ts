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

  async use(req: Request, res: Response): Promise<void> {
    const corsMiddleware = cors({
      origin: '*', // or specify allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    await new Promise(resolve => {
      corsMiddleware(req, res, () => {
        resolve(1);
      });
    });
  }
}
