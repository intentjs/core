import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty, isArray, isObject } from 'lodash';
import { Injectable } from '@nestjs/common';
import { IntentConfig } from '@libs/quicksilver/config/service';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValueFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private config: IntentConfig) {}

  validate(value: string, args: ValidationArguments): boolean {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);

    if (isEmpty(validValues) || !isArray(validValues)) {
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
    if (isObject(validValues)) {
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
