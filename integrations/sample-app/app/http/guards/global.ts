import {
  Injectable,
  IntentGuard,
  Reflector,
  Request,
  Response,
} from '@intentjs/core';

@Injectable()
export class GlobalGuard extends IntentGuard {
  async guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): Promise<boolean> {
    console.log('inside global guard');

    return true;
  }
}
