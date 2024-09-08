import { ReadStream } from 'fs';
import { ClassSerializerContextOptions, StreamableFile } from '@nestjs/common';
import { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Response as EResponse } from 'express';
import { HttpStatus } from './statusCodes';

export class Response {
  private $headers: Record<string, any>;
  private $data: Record<string, any>;
  private $statusCode: number;

  constructor(private response: EResponse) {
    this.$data = undefined;
    this.$headers = {};
    this.$statusCode = HttpStatus.OK;
  }

  send(data: any, statusCode = HttpStatus.OK): this {
    this.$data = data;
    this.response.status(statusCode);
    return this;
  }

  header(key: string, value: string): this {
    // this.$headers[key] = value;
    this.response.setHeader(key, value);
    return this;
  }

  status(status = HttpStatus.OK): this {
    this.response.status(status);
    return this;
  }

  stream(stream: ReadStream, options: StreamableFileOptions = {}): this {
    this.$data = new StreamableFile(stream, options);
    this.status(HttpStatus.OK);
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
