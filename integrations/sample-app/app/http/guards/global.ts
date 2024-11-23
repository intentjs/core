import { Injectable, IntentGuard, Reflector, Response } from '@intentjs/core';
import { Request } from 'hyper-express';

@Injectable()
export class GlobalGuard extends IntentGuard {
  async guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): Promise<boolean> {
    console.log('inside global guard');
    // await req.multipart(async (field) => {
    //   console.log('field ===> ', field.name, field.file);
    // });
    return true;
  }
}
