import { ClassSerializerContextOptions, StreamableFile } from '@nestjs/common';
import { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Response as EResponse } from 'express';
import { ReadStream } from 'fs';

export class Response {
  private $headers: Record<string, any>;
  private $data: Record<string, any>;
  private $statusCode: number;

  constructor(private response: EResponse) {
    this.$data = undefined;
    this.$headers = {};
    this.$statusCode = 200;
  }

  send(data: any, statusCode: number = 200): this {
    this.$data = data;
    this.response.status(statusCode);
    return this;
  }

  header(key: string, value: string): this {
    // this.$headers[key] = value;
    this.response.setHeader(key, value);
    return this;
  }

  status(status: number = 200): this {
    this.response.status(status);
    return this;
  }

  stream(stream: ReadStream, options: StreamableFileOptions = {}): this {
    this.$data = new StreamableFile(stream, options);
    this.status(200);
    return this;
  }

  data(): any {
    if (this.$data instanceof StreamableFile) {
      return this.$data;
    }

    return this.$data;
  }

  transformToPlain(
    plainOrClass: any,
    options: ClassSerializerContextOptions,
  ): Record<string, any> {
    if (!plainOrClass) {
      return plainOrClass;
    }
    if (!options.type) {
      return instanceToPlain(plainOrClass, options);
    }
    if (plainOrClass instanceof options.type) {
      return instanceToPlain(plainOrClass, options);
    }
    const instance = plainToInstance(options.type, plainOrClass);
    return instanceToPlain(instance, options);
  }
}
