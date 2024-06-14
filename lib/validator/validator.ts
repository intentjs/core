import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { isEmpty } from 'lodash';
import { ValidationFailed } from '../exceptions';
import { Obj } from '../utils';
import { Str } from '../utils/strings';

export class Validator<T> {
  private meta: Record<string, any>;
  constructor(private dto: Type<T>) {
    this.meta = {};
  }

  static compareWith<T>(dto: Type<T>): Validator<T> {
    return new Validator(dto);
  }

  /**
   * Use this method to add some extra information into your DTO.
   * Meta included is available at `$` property inside your DTO.
   * You can later use the meta properties inside your decorators.
   */
  addMeta(meta: Record<string, any>): this {
    this.meta = meta || {};
    return this;
  }

  async validate(inputs: Record<string, any>): Promise<T> {
    const schema: T = plainToInstance(this.dto, inputs);

    if (Obj.isNotEmpty(this.meta)) {
      this.injectMeta(schema);
    }

    schema['$'] = this.meta;

    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true,
    });

    this.removeContext(schema);
    this.processErrorsFromValidation(errors);

    return schema;
  }

  /**
   * Process errors, if any.
   * Throws new ValidationFailed Exception with validation errors
   */
  processErrorsFromValidation(errors: ValidationError[]): void {
    let bag = {};
    if (errors.length > 0) {
      for (const error of errors) {
        const errorsFromParser = this.parseError(error);
        const childErrorBag = {};
        for (const key in errorsFromParser) {
          if (!isEmpty(errorsFromParser[key])) {
            childErrorBag[key] = errorsFromParser[key];
          }
        }

        bag = { ...bag, ...childErrorBag };
      }

      throw new ValidationFailed(bag);
    }
  }

  parseError(error) {
    const children = [];
    for (const child of error.children || []) {
      children.push(this.parseError(child));
    }

    const messages = [];
    for (const c in error.constraints) {
      let message = error.constraints[c];
      message = message.replace(error.property, Str.title(error.property));
      messages.push(message);
    }

    const errors = {};
    if (!isEmpty(messages)) {
      errors[error.property] = messages;
    }

    for (const child of children) {
      for (const key in child) {
        errors[`${error.property}.${key}`] = child[key];
      }
    }

    return errors;
  }

  injectMeta<T>(schema: T): T {
    schema['$'] = this.meta || {};
    const inject = (obj: any, injectionKey: string, injectionValue: any) => {
      for (const key in obj) {
        if (key === injectionKey) continue;
        if (Obj.isObj(obj[key])) {
          obj[key] = inject(obj[key], injectionKey, obj[key]);
        }
        if (Array.isArray(obj[key])) {
          obj[key] = injectInArray(obj[key], injectionKey, injectionValue);
        }
      }

      obj[injectionKey] = injectionValue;

      return obj;
    };

    const injectInArray = function (
      obj: Array<any>,
      injectionKey: string,
      injectionValue: any,
    ) {
      for (const [index, arrObj] of obj.entries()) {
        if (Array.isArray(arrObj)) {
          obj[index] = injectInArray(arrObj, injectionKey, injectionValue);
        }
        if (Obj.isObj(arrObj)) {
          obj[index] = inject(arrObj, injectionKey, injectionValue);
        }
      }
      return obj;
    };

    return inject(schema, '$', this.meta);
  }

  removeContext(schema: T): void {
    delete schema['$'];
    const remove = (obj: any, injectionKey: string, injectionValue: any) => {
      for (const key in obj) {
        if (key === injectionKey) {
          delete obj[key];
        }
        if (Obj.isObj(obj[key])) {
          obj[key] = remove(obj[key], injectionKey, obj[key]);
        }
        if (Array.isArray(obj[key])) {
          obj[key] = removeFromArray(obj[key], injectionKey, injectionValue);
        }
      }
      return obj;
    };

    const removeFromArray = function (
      obj: Array<any>,
      injectionKey: string,
      injectionValue: any,
    ) {
      for (const [index, arrObj] of obj.entries()) {
        if (Array.isArray(arrObj)) {
          obj[index] = removeFromArray(arrObj, injectionKey, injectionValue);
        }
        if (Obj.isObj(arrObj)) {
          obj[index] = remove(arrObj, injectionKey, injectionValue);
        }
      }
      return obj;
    };

    return remove(schema, '$', this.meta);
  }
}
