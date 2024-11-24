import { UploadedFile } from '../../../storage/file-handlers/uploaded-file';
import { isEmpty } from '../../../utils';
import { Type } from '../../../interfaces';
import { Validator } from '../../../validator';
import { EXTENSTION_TO_MIME } from '../../../utils/extension-to-mime';
import { Request } from './interfaces';

export const INTENT_REQUEST_EXTENSIONS = {
  $dto: null,
  $user: null,
  uploadedFiles: new Map<string, UploadedFile | UploadedFile[]>(),

  setDto(dto: any): void {
    this.$dto = dto;
  },

  dto(): any {
    return this.$dto;
  },

  all(): Record<string, any> {
    return {
      ...(this.query_parameters || {}),
      ...(this.path_parameters || {}),
      ...(this.body || {}),
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
    return [true, 'yes', 'on', '1', 1, 'true'].includes(val?.toLowerCase());
  },

  hasHeader(name: string): boolean {
    return name in this.headers;
  },

  bearerToken(): string {
    const authHeader = this.headers['authorization'];
    const asArray = authHeader?.split(' ');
    if (!isEmpty(asArray)) return asArray[1];
    return undefined;
  },

  httpHost(): string {
    return this.protocol;
  },

  isHttp(): boolean {
    return this.httpHost() === 'http';
  },

  isHttps(): boolean {
    return this.httpHost() === 'https';
  },

  fullUrl(): string {
    return this.url;
  },

  isMethod(method: string): boolean {
    return this.method.toLowerCase() === method.toLowerCase();
  },

  contentType(): string {
    return this.headers['content-type'];
  },

  getAcceptableContentTypes(): string {
    return this.headers['accept'];
  },

  accepts(): string[] {
    return (this.headers['accept'] || '').split(',');
  },

  expectsJson(): boolean {
    return this.accepts().includes(EXTENSTION_TO_MIME['json']);
  },

  async validate<T>(schema: Type<T>): Promise<boolean> {
    const payload = this.all();
    const validator = Validator.compareWith(schema);
    const dto = await validator
      .addMeta({ ...payload, _headers: { ...this.headers } })
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
    const payload = this.all();
    return Object.fromEntries(
      keys.filter(key => key in payload).map(key => [key, payload[key]]),
    );
  },

  except(...keys: string[]): Record<string, any> {
    const payload = this.all();
    return Object.fromEntries(
      Object.entries(payload).filter(([key]) => !keys.includes(key)),
    );
  },

  isPath(pathPattern: string): boolean {
    return this.path === pathPattern;
  },

  has(...keys: string[]): boolean {
    const payload = this.all();
    return keys.every(key => key in payload);
  },

  hasAny(...keys: string[]): boolean {
    const payload = this.all();
    return keys.some(key => key in payload);
  },

  missing(...keys: string[]): boolean {
    const payload = this.all();
    return keys.every(key => !(key in payload));
  },

  hasHeaders(...keys: string[]): boolean {
    return keys.every(key => key in this.headers);
  },

  hasIncludes(): boolean {
    return Boolean(this.includes());
  },

  includes(): string {
    return this.string('include');
  },

  files(keys: string): Record<string, UploadedFile | UploadedFile[]> {
    if (!this.body) return {};
    // return Object.fromEntries(
    //   Object.entries(this.body).filter(
    //     ([key]) =>
    //       key === keys &&
    //       (this.body[key] instanceof UploadedFile ||
    //         Array.isArray(this.body[key])),
    //   ),
    // );
  },

  async file<T = UploadedFile | UploadedFile[] | undefined>(
    key: string,
  ): Promise<T> {
    const fileAtKey = this.body?.[key];
    if (!fileAtKey) return undefined as T;

    if (Array.isArray(fileAtKey)) {
      const values = fileAtKey.filter(file => file instanceof UploadedFile);
      return values as T;
    }

    if (!(fileAtKey instanceof UploadedFile)) return undefined as T;

    return fileAtKey as T;
  },
} as Request;
