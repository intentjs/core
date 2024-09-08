import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ERequest } from 'express';
import { Request } from '../rest/foundation/request';

@Injectable()
export class IntentValidationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const expressRequest = context.switchToHttp().getRequest() as ERequest;
    const request = expressRequest['intent'].req() as Request;
    const schema = this.reflector.get('dtoSchema', context.getHandler());
    await request.validate(schema);
    return true;
  }
}
