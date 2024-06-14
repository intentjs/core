import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class ValueInConstraint implements ValidatorConstraintInterface {
  async validate(value: any | Array<any>, args: ValidationArguments) {
    const [validValues] = args.constraints;
    if (typeof value === 'string') {
      return validValues.includes(value);
    }

    if (value instanceof Array) {
      const difference = value.filter((x) => validValues.indexOf(x) === -1);
      return !difference.length;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const property = args.property;
    return `${property} contains invalid values`;
  }
}

export function ValueIn(
  validValues: Array<any> | any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validValues],
      validator: ValueInConstraint,
    });
  };
}
