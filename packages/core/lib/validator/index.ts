import { applyDecorators } from '../reflections/apply-decorators';
import { SetMetadata } from '../reflections/set-metadata';
import { UseGuard } from '../rest';
import { IntentValidationGuard } from './validation-guard';

export * from './validator';
export * from './decorators';

export function Validate(DTO: any) {
  return applyDecorators(
    SetMetadata('dtoSchema', DTO),
    UseGuard(IntentValidationGuard),
  );
}
