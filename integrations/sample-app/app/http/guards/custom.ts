import { ExecutionContext, Injectable, IntentGuard } from '@intentjs/core';

@Injectable()
export class CustomGuard extends IntentGuard {
  async guard(ctx: ExecutionContext): Promise<boolean> {
    return true;
  }
}
