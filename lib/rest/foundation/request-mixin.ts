import { Request as ERequest } from 'express';
import { Validator } from '../../validator';
import { Type } from '../../interfaces';
import { isEmpty } from '../../utils';

export const RequestMixin = (request: ERequest) => ({
  $dto: null,
  $user: null,
  logger() {},

  setDto(dto: any): void {
    this.$dto = dto;
  },

  dto(): any {
    return this.$dto;
  },

  all(): Record<string, any> {
    return {
      ...(request.query || {}),
      ...(request.params || {}),
      ...(request.body || {}),
    };
  },

  input<T = string>(name: string, defaultValue?: T): T {
    const payload = this.all();
    return name in payload ? payload[name] : defaultValue;
  },

  string(name: string): string {
    const value = this.input(name);
    return value && value.toString();
  },

  number(name: string): number {
    const value = this.input(name);
    return +value;
  },

  boolean(name: string): boolean {
    const payload = this.all();
    const val = payload[name] as string;
    return [true, 'yes', 'on', '1', 1, 'true'].includes(val.toLowerCase());
  },

  hasHeader(name: string): boolean {
    return name in request.headers;
  },

  bearerToken(): string {
    const authHeader = request.headers['authorization'];
    const asArray = authHeader?.split(' ');
    if (!isEmpty(asArray)) return asArray[1];
    return undefined;
  },

  httpHost(): string {
    return request.protocol;
  },

  isHttp(): boolean {
    return this.httpHost() === 'http';
  },

  isHttps(): boolean {
    return this.httpHost() === 'https';
  },

  fullUrl(): string {
    return request.url;
  },

  isMethod(method: string): boolean {
    return request.method.toLowerCase() === method.toLowerCase();
  },

  getAcceptableContentTypes(): string {
    return request.headers['accept'];
  },

  expectsJson(): boolean {
    return request.accepts('json') === 'json';
  },

  async validate<T>(schema: Type<T>): Promise<boolean> {
    const payload = this.all();
    const validator = Validator.compareWith(schema);
    const dto = await validator
      .addMeta({ ...payload, _headers: { ...request.headers } })
      .validate({ ...payload });
    this.setDto(dto);
    return true;
  },

  setUser(user: any): void {
    this.$user = user;
  },

  user<T = any>(): T {
    return this.$user as T;
  },

  only(...keys: string[]): Record<string, any> {
    console.log(keys);
    return {};
  },

  except(...keys: string[]): Record<string, any> {
    console.log(keys);
    return {};
  },

  isPath(pathPattern: string): boolean {
    console.log(request, pathPattern);
    return false;
  },

  has(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (!(key in payload)) return false;
    }

    return true;
  },

  hasAny(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (key in payload) return true;
    }

    return false;
  },

  missing(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (key in payload) return false;
    }

    return true;
  },

  hasHeaders(...keys: string[]): boolean {
    for (const key of keys) {
      if (!(key in request.headers)) return false;
    }

    return true;
  },

  hasIncludes(): boolean {
    const includes = this.includes();
    return includes === '';
  },

  includes(): string {
    return this.string('include');
  },
});
