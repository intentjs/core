import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from '../request';
import { Response } from '../response';

export abstract class IntentGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const expressRequest = context.switchToHttp().getRequest();
    return this.boot(expressRequest.intent.req(), expressRequest.intent.res());
  }

  abstract boot(req: Request, res: Response): boolean | Promise<boolean>;
}
