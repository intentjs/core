import { ExecutionContext, Injectable, IntentGuard } from '@intentjs/core';

@Injectable()
export class GlobalGuard extends IntentGuard {
  async guard(ctx: ExecutionContext): Promise<boolean> {
    return true;
  }
}
