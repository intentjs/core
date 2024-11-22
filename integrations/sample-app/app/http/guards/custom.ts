import { Injectable, IntentGuard, Reflector } from '@intentjs/core';
import { Request, Response } from 'hyper-express';

@Injectable()
export class CustomGuard extends IntentGuard {
  async guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): Promise<boolean> {
    console.log('urnning inside guard');
    await req.multipart(async (field) => {
      console.log('field ===> ', field.name, field.file);
    });
    return false;
  }
}
