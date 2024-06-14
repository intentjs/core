import { Request as BaseRequest } from 'express';
import { Response as BaseResponse } from 'express';

export interface Request extends BaseRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  /**
   * Get the current user from the request object
   */
  user: Record<string, any>;
}

export interface Response extends BaseResponse {
  success(
    data: Record<string, any> | Array<any> | string,
    status?: number | string,
  ): any;

  error(error: Record<string, any> | string, status?: number | string): any;

  noContent(): any;

  withMeta(data: Record<string, any>, status?: number | string): any;
}

export interface ServerOptions {
  addValidationContainer?: boolean;
  port?: number;
  globalPrefix?: string;
}
