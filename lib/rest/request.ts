// import { Str } from '../utils/str';
import { Type } from "@nestjs/common";
import { Request as ERequest } from "express";
import { Validator } from "../validator";
import { ulid } from "ulid";
import { isEmpty } from "lodash";

export class Request {
  private $payload: Record<string, any>;
  private $headers: Record<string, any>;
  private $query: Record<string, any>;
  private $pathParams: Record<string, any>;
  private $body: Record<string, any>;
  private $dto: any;
  private id: string;

  constructor(private request: ERequest) {
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

  input<T = string>(name: string, defaultValue?: T): T {
    return name in this.$payload ? this.$payload[name] : defaultValue;
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
    const val = this.$payload[name] as string;
    return [true, "yes", "on", "1", 1, "true"].includes(val.toLowerCase());
  }

  query<T = Record<string, any>>(name?: string): T {
    return name ? this.$query[name] : this.$query;
  }

  path<T = Record<string, any>>(): T {
    return this.request.params as T;
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
    const authHeader = this.$headers["authorization"];
    const asArray = authHeader?.split(" ");
    return !isEmpty(asArray) && asArray(" ")[1];
  }

  host(): string {
    return this.request.get("host");
  }

  httpHost(): string {
    return this.request.protocol;
  }

  isHttp(): boolean {
    return this.httpHost() === "http";
  }

  isHttps(): boolean {
    return this.httpHost() === "https";
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
    const accept = this.$headers["accept"];
    return accept.split(",");
  }

  accepts(contentTypes: string[]): boolean {
    const accept = this.$headers["accept"];
    if (accept == "*/*") return true;
    return contentTypes.includes(accept);
  }

  expectsJson(): boolean {
    return this.$headers["accept"];
  }

  async validate<T>(dto: Type<T>): Promise<T> {
    const payload = this.all();
    const validator = Validator.compareWith(dto);
    return validator
      .addMeta({ ...payload, _headers: { ...this.$headers } })
      .validate({ ...this.all() });
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
    console.log("kjeys ===> ", keys);
    for (const key of keys) {
      if (!(key in this.$payload)) return false;
    }

    return true;
  }

  hasAny(...keys: string[]): boolean {
    for (const key of keys) {
      if (key in this.$payload) return true;
    }

    return false;
  }

  missing(...keys: string[]): boolean {
    for (const key of keys) {
      if (key in this.$payload) return false;
    }

    return true;
  }

  hasHeaders(...keys: string[]): boolean {
    console.log("has header keys ===> ", keys);
    return false;
  }
}
