import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from '../interface';
import { Reflector } from '../../../reflections';

export abstract class IntentGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Get Express Request Object
     */
    const expressRequest = context.switchToHttp().getRequest();

    /**
     * Get Express Response Object
     */
    const expressResponse = context.switchToHttp().getResponse();

    /**
     * Initialise a new Reflector class.
     */
    const reflector = new Reflector(context.getClass(), context.getHandler());

    return this.guard(expressRequest, expressResponse, reflector);
  }

  abstract guard(
    req: Request,
    res: Response,
    reflector: Reflector,
  ): boolean | Promise<boolean>;
}
