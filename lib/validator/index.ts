import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from '../rest/foundation';
import { IntentValidationGuard } from './validationGuard';

export * from './validator';
export * from './decorators';

export function Validate(DTO: any) {
  return applyDecorators(
    SetMetadata('dtoSchema', DTO),
    UseGuards(IntentValidationGuard),
  );
}

export const Dto = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const contextType = ctx['contextType'];
    if (contextType === 'ws') {
      return ctx.switchToWs().getClient()._dto;
    }
    const request = ctx.switchToHttp().getRequest();
    const intentRequest = request.intent.req() as Request;
    return intentRequest.body();
  },
);
