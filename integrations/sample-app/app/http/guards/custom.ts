import { Injectable, IntentGuard, Reflector } from '@intentjs/core';
import { HonoRequest } from 'hono';

@Injectable()
export class CustomGuard extends IntentGuard {
  guard(
    req: HonoRequest,
    res: Response,
    reflector: Reflector,
  ): boolean | Promise<boolean> {
    console.log('urnning inside guard');
    console.log({
      method: req.method,
      url: req.url,
      headers: req.header(),
      query: req.query(),
    });
    return false;
  }
}
