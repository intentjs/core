import uWS from 'uWebSockets.js';
import { Request as HyperRequest, MultipartHandler } from 'hyper-express';
import { isEmpty, Str } from '../../utils';
import { EXTENSTION_TO_MIME } from '../../utils/extension-to-mime';
import { Type } from '../../interfaces';
import { Validator } from '../../validator';
import { tmpdir } from 'os';
import { ulid } from 'ulid';
import { UploadedFile } from '../../storage/file-handlers/uploaded-file';
import { join } from 'path';
import { ConfigService } from '../../config';

export const createRequestFromHyper = async (hReq: HyperRequest) => {
  const headers = { ...hReq.headers };

  const enabledParsers = ConfigService.get('http.parsers') || [];
  const contentType = headers['content-type'] || '';

  let body = undefined;
  if (
    enabledParsers.includes('urlencoded') &&
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    body = await hReq.urlencoded();
  } else if (
    enabledParsers.includes('json') &&
    contentType.includes('application/json')
  ) {
    body = await hReq.json();
  } else if (
    enabledParsers.includes('formdata') &&
    contentType.includes('multipart/form-data')
  ) {
    body = {};
    const multipartData = await processMultipartData(hReq);
    for (const [key, value] of multipartData.entries()) {
      body[key] = value;
    }
  } else if (
    enabledParsers.includes('plain') &&
    contentType.includes('text/plain')
  ) {
    body = await hReq.text();
  } else if (
    (enabledParsers.includes('html') && contentType.includes('text/html')) ||
    (enabledParsers.includes('xml') && contentType.includes('application/xml'))
  ) {
    body = (await hReq.buffer()).toString();
  } else {
    body = await hReq.buffer();
  }

  return new Request(
    hReq.raw,
    hReq.method,
    hReq.url,
    headers,
    { ...hReq.query_parameters },
    { ...hReq.path_parameters },
    body,
    hReq.text.bind(hReq),
    hReq.buffer.bind(hReq),
    hReq.path,
    hReq.protocol,
    hReq.ips,
    hReq.multipart.bind(hReq),
  );
};

export class Request {
  private uploadedFiles = new Map<string, UploadedFile | UploadedFile[]>();

  constructor(
    public readonly raw: uWS.HttpRequest,
    public readonly method: string,
    public readonly url: string,
    public readonly headers: Record<string, any>,
    public readonly query: Record<string, any>,
    public readonly params: Record<string, any>,
    public readonly body: any,
    public readonly text: () => Promise<string>,
    public readonly buffer: () => Promise<Buffer>,
    public readonly path: string,
    public readonly protocol: string,
    public readonly ip: string[],
    public readonly multipart: (handler: MultipartHandler) => Promise<void>,
  ) {}

  $dto: null;
  $user: null;
  logger() {}

  setDto(dto: any): void {
    this.$dto = dto;
  }

  dto(): any {
    return this.$dto;
  }

  all(): Record<string, any> {
    return {
      ...(this.query || {}),
      ...(this.params || {}),
      ...(this.body || {}),
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

  hasHeader(name: string): boolean {
    return name in this.headers;
  }

  bearerToken(): string {
    const authHeader = this.headers['authorization'];
    const asArray = authHeader?.split(' ');
    if (!isEmpty(asArray)) return asArray[1];
    return undefined;
  }

  httpHost(): string {
    return this.protocol;
  }

  isHttp(): boolean {
    return this.httpHost() === 'http';
  }

  isHttps(): boolean {
    return this.httpHost() === 'https';
  }

  fullUrl(): string {
    return this.url;
  }

  isMethod(method: string): boolean {
    return this.method.toLowerCase() === method.toLowerCase();
  }

  contentType(): string[] {
    return this.headers['content-type']?.split(',') || [];
  }

  getAcceptableContentTypes(): string {
    return this.headers['accept'];
  }

  accepts(): string[] {
    const getAcceptableContentTypes = this.headers['accept'] || [];
    return (this.headers['accept'] || '').split(',');
  }

  expectsJson(): boolean {
    return this.accepts().includes(EXTENSTION_TO_MIME['json']);
  }

  async validate<T>(schema: Type<T>): Promise<boolean> {
    const payload = this.all();
    const validator = Validator.compareWith(schema);
    const dto = await validator
      .addMeta({ ...payload, _headers: { ...this.headers } })
      .validate({ ...payload });
    this.setDto(dto);
    return true;
  }

  setUser(user: any): void {
    this.$user = user;
  }

  user<T = any>(): T {
    return this.$user as T;
  }

  only(...keys: string[]): Record<string, any> {
    return {};
  }

  except(...keys: string[]): Record<string, any> {
    console.log(keys);
    return {};
  }

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
      if (!(key in this.headers)) return false;
    }

    return true;
  }

  hasIncludes(): boolean {
    const includes = this.includes();
    return includes === '';
  }

  includes(): string {
    return this.string('include');
  }

  files(keys: string): Record<string, UploadedFile | UploadedFile[]> {
    return {};
  }

  async file<T = UploadedFile | UploadedFile[] | undefined>(
    key: string,
  ): Promise<T> {
    const fileAtKey = this.body[key];
    const values = [] as UploadedFile[];
    const isArray = Array.isArray(fileAtKey);
    if (isArray) {
      for (const file of fileAtKey) {
        if (file instanceof UploadedFile) {
          values.push(file);
        }
      }

      return values as T;
    }

    if (!(fileAtKey instanceof UploadedFile)) return undefined;

    return fileAtKey as T;
  }
}

const processMultipartData = async (
  req: HyperRequest,
): Promise<Map<string, any>> => {
  const fields = new Map<string, any>();
  const tempDirectory = tmpdir();
  const generateTempFilename = (filename: string) => `${ulid()}-${filename}`;

  try {
    await req.multipart(async field => {
      /**
       * check if the field name is an array based, or an associative index
       */
      const isArray = Str.is(field.name, '*[*]');
      const strippedFieldName = Str.before(field.name, '[');
      const existingFieldValue = fields.get(strippedFieldName);

      if (isArray && !existingFieldValue) {
        fields.set(strippedFieldName, []);
      }

      if (field.file) {
        const tempFileName = generateTempFilename(field.file.name);
        const tempFilePath = join(tempDirectory, tempFileName);
        let fileSize = 0;
        field.file.stream.on('data', chunk => {
          fileSize += chunk.length;
        });

        await field.write(tempFilePath);

        const uploadedFile = new UploadedFile(
          field.file.name,
          fileSize,
          field.mime_type,
          tempFileName,
          tempFilePath,
        );
        if (Array.isArray(existingFieldValue)) {
          fields.set(
            strippedFieldName,
            existingFieldValue.concat(uploadedFile),
          );
        } else {
          fields.set(strippedFieldName, uploadedFile);
        }
      } else {
        if (Array.isArray(existingFieldValue)) {
          fields.set(strippedFieldName, existingFieldValue.concat(field.value));
        } else {
          fields.set(strippedFieldName, field.value);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }

  return fields;
};
