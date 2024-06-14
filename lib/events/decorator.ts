import 'reflect-metadata';
import { SquareboatNestEventConstants } from './constants';
import { GenericClass } from './interfaces';

export function Event(name?: string) {
  return function (target: GenericClass) {
    Reflect.defineMetadata(
      SquareboatNestEventConstants.eventEmitterName,
      name || target['name'],
      target,
    );
  };
}

export function ListensTo(event: string | GenericClass) {
  const eventName = typeof event === 'string' ? event : event['name'];
  return function (target: Record<string, any>, propertyKey: string) {
    Reflect.defineMetadata(
      SquareboatNestEventConstants.eventName,
      eventName,
      target,
      propertyKey,
    );
  };
}
