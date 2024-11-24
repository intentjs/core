import {
  Injectable,
  IntentGuard,
  Reflector,
  Request,
  Response,
} from '@intentjs/core';

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
