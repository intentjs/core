import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Request as BaseRequest } from 'express';

export interface IRequest extends BaseRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  /**
   * Get the current user from the request object
   */
  user: Record<string, any>;
}

export interface ServerOptions {
  addValidationContainer?: boolean;
  port?: number;
  globalPrefix?: string;
  exceptionFilter?: (httpAdapter: AbstractHttpAdapter) => BaseExceptionFilter;
  cors?: CorsOptions;
}
