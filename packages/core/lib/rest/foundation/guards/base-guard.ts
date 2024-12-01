import { ForbiddenException } from '../../../exceptions/forbidden-exception';
import { ExecutionContext } from '../../http-server/contexts/execution-context';

export abstract class IntentGuard {
  async handle(context: ExecutionContext): Promise<void> {
    const validationFromGuard = await this.guard(context);
    if (!validationFromGuard) {
      throw new ForbiddenException('Forbidden Resource');
    }
  }

  abstract guard(ctx: ExecutionContext): boolean | Promise<boolean>;
}
