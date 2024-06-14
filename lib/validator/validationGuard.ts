import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from '../rest';

@Injectable()
export class IntentValidationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const iRequest = request['_req'];
    const schema = this.reflector.get('dtoSchema', context.getHandler());
    iRequest.addDto(await iRequest.validate(schema));
    return true;
  }
}
