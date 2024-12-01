import { INestApplicationContext } from '@nestjs/common';

export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type IntentApplicationContext = INestApplicationContext;
