import { Reflector } from '../../../reflections';
import { ForbiddenException } from '../../../exceptions/forbidden-exception';
import { Request } from '../../http-server/request/interfaces';
import { ExecutionContext } from '../../http-server/contexts/execution-context';
import { Response } from '../../http-server/response';

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
