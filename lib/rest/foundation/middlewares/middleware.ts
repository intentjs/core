import { NestMiddleware } from '@nestjs/common';
import {
  Request as HRequest,
  Response as HResponse,
  NextFunction,
} from 'express';
import { Request } from '../request';
import { Response } from '../response';

export abstract class IntentMiddleware implements NestMiddleware {
  async use(
    eReq: HRequest,
    eRes: HResponse,
    eNext: NextFunction,
  ): Promise<void> {
    await this.boot(eReq['intent'].req(), eReq['intent'].res(), eNext);
  }

  abstract boot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Promise<void>;
}
