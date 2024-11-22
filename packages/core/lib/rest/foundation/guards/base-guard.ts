import { Reflector } from '../../../reflections';
import { ExecutionContext } from '../custom-server/execution-context';
import { Request, Response } from 'hyper-express';

export abstract class IntentGuard {
  async handle(context: ExecutionContext): Promise<boolean> {
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

    return this.guard(request, response, reflector);
  }

  abstract guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): boolean | Promise<boolean>;
}
