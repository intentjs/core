import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IntentConfig } from '../../config/service';
import { Obj } from '../../utils';
import { Arr } from '../../utils/array';
import { isEmpty } from '../../utils/helpers';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValueFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private config: IntentConfig) {}

  validate(value: string, args: ValidationArguments): boolean {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);

    if (isEmpty(validValues) || !Arr.isArray(validValues)) {
      return false;
    }

    if (validValues.includes(value)) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);
    return `${args.property} should have either of ${validValues.join(
      ', ',
    )} as value`;
  }

  private getValues(key: string): any {
    let validValues: Array<string> = this.config.get(key);
    if (Obj.isObj(validValues)) {
      validValues = Object.values(validValues);
    }

    return validValues;
  }
}

export function IsValueFromConfig(
  options: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValueFromConfigConstraint,
    });
  };
}
