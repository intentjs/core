import { Injectable, IntentGuard, Reflector, Response } from '@intentjs/core';
import { Request } from '@intentjs/core/dist/lib/rest/http-server/request';

@Injectable()
export class CustomGuard extends IntentGuard {
  async guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): Promise<boolean> {
    return true;
  }
}
