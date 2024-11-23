import { Injectable, IntentGuard, Reflector, Response } from '@intentjs/core';
import { Request } from 'hyper-express';

@Injectable()
export class CustomGuard extends IntentGuard {
  async guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): Promise<boolean> {
    await req.multipart(async (field) => {
      console.log('field ===> ', field.name, field.file);
    });
    return true;
  }
}
