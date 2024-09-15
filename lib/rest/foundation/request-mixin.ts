import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';
import { Type } from '../../interfaces';
import { isEmpty, Obj, Str } from '../../utils';
import { Validator } from '../../validator';

export const RequestMixin = (request: Request) => ({
  $dto: null,
  $user: null,
  logger() {},

  setBody(dto: any): void {
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

  query<T = unknown>(name?: string): T {
    const query: Record<string, any> = request.query || {};
    return name ? query[name] : query;
  },

  pathParams<T = Record<string, any>>(): T {
    return request.params as T;
  },

  hasHeader(name: string): boolean {
    return name in request.headers;
  },

  bearerToken(): string {
    const authHeader = request.headers['authorization'];
    const asArray = authHeader?.split(' ');
    return !isEmpty(asArray) && asArray[1];
  },

  host(): string {
    return request.get('host');
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
    return request.method === method;
  },

  getAcceptableContentTypes(): IncomingHttpHeaders {
    return request.headers;
  },

  accepts(contentTypes: string[]): boolean {
    const accept = request.headers['accept'];
    if (accept == '*/*') return true;
    return contentTypes.includes(accept);
  },

  expectsJson(): boolean {
    return true;
  },

  async validate<T>(schema: Type<T>): Promise<void> {
    const payload = this.all();
    const validator = Validator.compareWith(schema);
    const dto = await validator
      .addMeta({ ...payload, _headers: { ...request.headers } })
      .validate({ ...payload });
    this.setBody(dto);
  },

  setUser(user: any): void {
    this.$user = user;
  },

  user<T = any>(): T {
    return this.$user as T;
  },

  only(...keys: string[]): Record<string, any> {
    return Obj.pick(this.all(), keys);
  },

  except(...keys: string[]): Record<string, any> {
    return Obj.except(this.all(), keys);
  },

  isPath(pathPattern: string): boolean {
    return Str.is(request.path, pathPattern);
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
    return true;
  },

  includes(): string[] {
    return [];
  },
});
