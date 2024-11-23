import { Reflector } from '../../../reflections';
import { Request } from 'hyper-express';
import { ForbiddenException } from '../../../exceptions/forbidden-exception';
import { ExecutionContext, Response } from '../../http-server';

export abstract class IntentGuard {
  async handle(context: ExecutionContext): Promise<void> {
    /**
     * Get Express Request Object
     */
    const request = context.switchToHttp().getRequest();

    /**
     * Get Express Response Object
     */
    const response = context.switchToHttp().getResponse();

    /**
     * Initialise a new Reflector class.
     */
    const reflector = new Reflector(context.getClass(), context.getHandler());

    const validationFromGuard = await this.guard(request, response, reflector);
    if (!validationFromGuard) {
      throw new ForbiddenException('Forbidden Resource');
    }
  }

  abstract guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): boolean | Promise<boolean>;
}
