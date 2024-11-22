import { Type } from '../../../interfaces';
import { SetMetadata } from '../../../reflections';
import { IntentGuard } from '../guards/base-guard';

export const CONTROLLER_KEY = '@intentjs/controller_path';
export const CONTROLLER_OPTIONS = '@intentjs/controller_options';

export const METHOD_KEY = '@intentjs/controller_method_key';
export const METHOD_PATH = '@intentjs/controller_method_path';

export const GUARD_KEY = '@intentjs/controller_guards';

export type ControllerOptions = {
  host?: string;
};

export enum HttpMethods {
  GET,
  POST,
  PUT,
  PATCH,
  OPTIONS,
  HEAD,
  DELETE,
  ANY,
}

export function IController(path?: string, options?: ControllerOptions) {
  return function (target: Function) {
    // if (descriptor) {
    //   Reflect.defineMetadata(CONTROLLER_KEY, path, descriptor.value);
    //   return descriptor;
    // }

    Reflect.defineMetadata(CONTROLLER_KEY, path || '', target);
    Reflect.defineMetadata(CONTROLLER_OPTIONS, options, target);
  };
}

export function IGet(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.GET, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export function IPost(path?: string, options?: ControllerOptions) {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    Reflect.defineMetadata(METHOD_KEY, HttpMethods.POST, target, key);
    Reflect.defineMetadata(METHOD_PATH, path, target, key);
    return descriptor;
  };
}

export const IUseGuards = (...guards: Type<IntentGuard>[]) => {
  return function (target: object, key?: string | symbol, descriptor?: any) {
    if (key) {
      Reflect.defineMetadata(GUARD_KEY, guards, target, key);
      return;
    }
    Reflect.defineMetadata(GUARD_KEY, guards, target);
    return;
  };
};
