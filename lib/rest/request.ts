// import { Str } from '../utils/str';
import { Type } from '@nestjs/common';
import { Request } from 'express';
import { Validator } from '../validator';
import { ulid } from 'ulid';

export class IntentRequest {
  private $payload: Record<string, any>;
  private $headers: Record<string, any>;
  private $query: Record<string, any>;
  private $pathParams: Record<string, any>;
  private $body: Record<string, any>;
  private $dto: any;
  private id: string;

  constructor(private request: Request) {
    this.$payload = {};
    this.$headers = {};
    this.initiate();
    this.id = ulid();
  }

  private initiate() {
    this.$query = this.request.query;
    this.$body = this.request.body;
    this.$pathParams = this.request.params;
    this.$headers = this.request.headers;
    this.$payload = { ...this.$query, ...this.$pathParams, ...this.$body };
  }

  logger() {}

  addDto(dto: any): void {
    this.$dto = dto;
  }

  dto(): any {
    return this.$dto;
  }

  all(): Record<string, any> {
    return this.$payload;
  }

  input<T = string>(name: string, defaultValue?: any): T {
    return name in this.$payload ? this.$payload[name] : defaultValue;
  }

  string(name: string): string {
    return this.$payload[name];
  }

  number(name: string): number {
    return +this.$payload[name];
  }

  boolean(name: string): boolean {
    const val = this.$payload[name] as string;
    return [true, 'yes', 'on', '1', 1, 'true'].includes(val.toLowerCase());
  }

  query<T>(name?: string): T {
    return name ? this.$query[name] : this.$query;
  }

  path(): string {
    return this.request.path;
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
    if (!authHeader) return undefined;
    return authHeader.split(' ')[1];
  }

  host(): string {
    return this.request.get('host');
  }

  httpHost(): string {
    return this.request.protocol;
  }

  isHttp(): boolean {
    return this.httpHost() === 'http';
  }

  isHttps(): boolean {
    return this.httpHost() === 'https';
  }

  url(): string {
    return this.request.url;
  }

  fullUrl(): string {
    return this.request.url;
  }

  ip(): string {
    return this.request.ip;
  }

  ips(): string[] {
    return this.request.ips;
  }

  method(): string {
    return this.request.method;
  }

  isMethod(method: string): boolean {
    return this.request.method === method;
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

  async validate<T>(dtoSchema: Type<T>): Promise<T> {
    const payload = this.all();
    const validator = Validator.compareWith(dtoSchema);
    return validator
      .addMeta({ ...payload, _headers: { ...this.$headers } })
      .validate({ ...payload });
  }

  only(...keys: string[]): Record<string, any> {
    console.log(keys);
    return {};
  }

  except(...keys: string[]): Record<string, any> {
    console.log(keys);
    return {};
  }

  is(pathPattern: string): boolean {
    console.log(pathPattern);
    return false;
  }

  has(...keys: string[]): boolean {
    console.log('kjeys ===> ', keys);
    return true;
  }

  missing(...keys: string[]): boolean {
    console.log('missing keys ===> ', keys);
    return false;
  }

  hasHeaders(...keys: string[]): boolean {
    console.log('has header keys ===> ', keys);
    return false;
  }

  //   schemeAndHttpHost(): string {}

  //   has(): boolean {}

  //   async whenHas(): Promise<void> {}

  //   async hasAny(): Promise<void> {}

  //   filled(): boolean {}

  //   anyFilled(): boolean {}

  //   missing(): boolean {}

  //   merge() {}

  //   mergeIfMissing() {}
}
