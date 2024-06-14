import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { IntentValidationGuard } from './validationGuard';
import { IntentRequest } from '../rest/request';

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
    const intentRequest = request._req as IntentRequest;
    return intentRequest.dto();
  },
);
