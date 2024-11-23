import { Injectable } from '@nestjs/common';
import { applyDecorators } from '../../reflections/apply-decorators';
import { Type } from '../../interfaces';
import { IntentGuard } from '../foundation';

export const CONTROLLER_KEY = '@intentjs/controller_path';
export const CONTROLLER_OPTIONS = '@intentjs/controller_options';

export const METHOD_KEY = '@intentjs/controller_method_key';
export const METHOD_PATH = '@intentjs/controller_method_path';

export const GUARD_KEY = '@intentjs/controller_guards';

export type ControllerOptions = {
  host?: string;
};

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  ANY = 'ANY',
}

export function Controller(path?: string, options?: ControllerOptions) {
  return applyDecorators(Injectable(), ControllerMetadata(path, options));
}

export function ControllerMetadata(path?: string, options?: ControllerOptions) {
  return function (target: Function) {
    Reflect.defineMetadata(CONTROLLER_KEY, path || '', target);
    Reflect.defineMetadata(CONTROLLER_OPTIONS, options, target);
  };
}

function createRouteDecorators(
  method: HttpMethods,
  path?: string,
  options?: ControllerOptions,
): MethodDecorator {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, method, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export type RouteDecoratorType = (
  path?: string,
  options?: ControllerOptions,
) => MethodDecorator;

export const Get: RouteDecoratorType = (path, options) =>
  createRouteDecorators(HttpMethods.GET, path, options);

export function Post(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.POST, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Put(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.PUT, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Patch(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.PATCH, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Delete(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.DELETE, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Options(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.OPTIONS, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Head(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.HEAD, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function Any(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.ANY, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export const UseGuard = (...guards: Type<IntentGuard>[]) => {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    if (key) {
      Reflect.defineMetadata(GUARD_KEY, guards, target, key);
      return;
    }
    Reflect.defineMetadata(GUARD_KEY, guards, target);
    return;
  };
};
