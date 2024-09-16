import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from '../interface';

export abstract class IntentGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const expressRequest = context.switchToHttp().getRequest();
    return this.boot(expressRequest, expressRequest);
  }

  abstract boot(req: Request, res: Response): boolean | Promise<boolean>;
}
