import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplicationContext } from '@nestjs/common';

export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

export * from './transformer';
export * from './config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type IntentApplication = NestExpressApplication;
export type IntentApplicationContext = INestApplicationContext;
