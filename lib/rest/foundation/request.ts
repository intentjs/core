import { Type } from '@nestjs/common';
import { Request as ERequest } from 'express';
import { isEmpty } from 'lodash';
import { Validator } from '../../validator';

export class Request {
  private $headers: Record<string, any>;
  private $dto: any;
  private id: string;
  private $user: Record<string, any>;

  constructor(private readonly raw: ERequest) {
    this.$headers = {};
    this.initiate(raw);
    this.$user = null;
    this.$headers = raw.headers;
  }

  private initiate(request: ERequest) {
    this.$headers = request.headers;
  }

  logger() {}

  setBody(dto: any): void {
    this.$dto = dto;
  }

  body(): any {
    return this.$dto;
  }

  all(): Record<string, any> {
    return {
      ...(this.raw.query || {}),
      ...(this.raw.params || {}),
      ...(this.raw.body || {}),
    };
  }

  input<T = string>(name: string, defaultValue?: T): T {
    const payload = this.all();
    return name in payload ? payload[name] : defaultValue;
  }

  string(name: string): string {
    const value = this.input(name);
    return value && value.toString();
  }

  number(name: string): number {
    const value = this.input(name);
    return +value;
  }

  boolean(name: string): boolean {
    const payload = this.all();
    const val = payload[name] as string;
    return [true, 'yes', 'on', '1', 1, 'true'].includes(val.toLowerCase());
  }

  query<T = unknown>(name?: string): T {
    const query: Record<string, any> = this.raw.query || {};
    return name ? query[name] : query;
  }

  pathParams<T = Record<string, any>>(): T {
    return this.raw.params as T;
  }

  header(name: string): string {
    return this.$headers[name];
  }

  headers(): Record<string, any> {
    return this.$headers;
  }

  hasHeader(name: string): boolean {
    return name in this.$headers;
  }

  bearerToken(): string {
    const authHeader = this.$headers['authorization'];
    const asArray = authHeader?.split(' ');
    return !isEmpty(asArray) && asArray[1];
  }

  host(): string {
    return this.raw.get('host');
  }

  httpHost(): string {
    return this.raw.protocol;
  }

  isHttp(): boolean {
    return this.httpHost() === 'http';
  }

  isHttps(): boolean {
    return this.httpHost() === 'https';
  }

  url(): string {
    return this.raw.url;
  }

  fullUrl(): string {
    return this.raw.url;
  }

  ip(): string {
    return this.raw.ip;
  }

  ips(): string[] {
    return this.raw.ips;
  }

  method(): string {
    return this.raw.method;
  }

  isMethod(method: string): boolean {
    return this.raw.method === method;
  }

  getAcceptableContentTypes(): string[] {
    const accept = this.$headers['accept'];
    return accept.split(',');
  }

  accepts(contentTypes: string[]): boolean {
    const accept = this.$headers['accept'];
    if (accept == '*/*') return true;
    return contentTypes.includes(accept);
  }

  expectsJson(): boolean {
    return this.$headers['accept'];
  }

  async validate<T>(schema: Type<T>): Promise<void> {
    const payload = this.all();
    const validator = Validator.compareWith(schema);
    const dto = await validator
      .addMeta({ ...payload, _headers: { ...this.$headers } })
      .validate({ ...payload });
    this.setBody(dto);
  }

  setUser(user: any): void {
    this.$user = user;
  }

  user<T = any>(): T {
    return this.$user as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  only(...keys: string[]): Record<string, any> {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  except(...keys: string[]): Record<string, any> {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPath(pathPattern: string): boolean {
    return false;
  }

  has(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (!(key in payload)) return false;
    }

    return true;
  }

  hasAny(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (key in payload) return true;
    }

    return false;
  }

  missing(...keys: string[]): boolean {
    const payload = this.all();
    for (const key of keys) {
      if (key in payload) return false;
    }

    return true;
  }

  hasHeaders(...keys: string[]): boolean {
    for (const key of keys) {
      if (!(key in this.$headers)) return false;
    }

    return true;
  }

  toJSON() {
    return { msg: 'custom request payload' };
  }
}
