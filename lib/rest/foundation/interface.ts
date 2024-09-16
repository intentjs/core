/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { IncomingHttpHeaders } from 'http';
import { Request as ERequest, Response as EResponse } from 'express';
import { Type } from '../../interfaces';

export type Response = EResponse;

export interface Request extends ERequest {
  logger: Function;
  setDto: Function;
  dto: () => any;
  all: () => Record<string, any>;
  input: <T = string>(name: string, defaultValue?: T) => T;
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
  hasHeader: (name: string) => boolean;
  bearerToken: () => string;
  //   host: () => string;
  httpHost: () => string;
  isHttp: () => boolean;
  isHttps: () => boolean;
  fullUrl: () => string;
  isMethod: (method: string) => boolean;
  getAcceptableContentTypes: () => IncomingHttpHeaders;
  //   accepts: (...contentTypes: string[]) => boolean;
  expectsJson: () => boolean;
  validate: <T>(schema: Type<T>) => Promise<void>;
  setUser: (user: any) => void;
  use: <T = any>() => T;
  only: (...keys: string[]) => Record<string, any>;
  except: (...keys: string[]) => Record<string, any>;
  isPath: (pattern: string) => boolean;
  has: (...keys: string[]) => boolean;
  hasAny: (...keys: string[]) => boolean;
  missing: (...keys: string[]) => boolean;
  hasHeaders: (...headers: string[]) => boolean;
  hasIncludes: () => boolean;
  includes: () => string[];
}
