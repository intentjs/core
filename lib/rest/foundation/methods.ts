import {
  Get as NGet,
  Post as NPost,
  Put as NPut,
  Patch as NPatch,
  Delete as NDelete,
  All as NAll,
  Options as NOptions,
  Head as NHead,
  applyDecorators,
} from '@nestjs/common';

export const Get = (path?: string | string[]) => applyDecorators(NGet(path));

/**
 * POST Method
 * @param path
 * @returns
 */
export const Post = (path?: string | string[]) => applyDecorators(NPost(path));

/**
 * PUT Method
 * @param path
 * @returns
 */
export const Put = (path?: string | string[]) => applyDecorators(NPut(path));

/**
 * PATCH Method
 * @param path
 * @returns
 */
export const Patch = (path?: string | string[]) =>
  applyDecorators(NPatch(path));

/**
 * DELETE Method
 * @param path
 * @returns
 */
export const Delete = (path?: string | string[]) =>
  applyDecorators(NDelete(path));

/**
 * ALL Method
 * @param path
 * @returns
 */
export const All = (path?: string | string[]) => applyDecorators(NAll(path));

/**
 * Options Method
 * @param path
 * @returns
 */
export const Options = (path?: string | string[]) =>
  applyDecorators(NOptions(path));

/**
 * HEAD Method
 * @param path
 * @returns
 */
export const Head = (path?: string | string[]) => applyDecorators(NHead(path));

export enum RequestMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3,
  PATCH = 4,
  ALL = 5,
  OPTIONS = 6,
  HEAD = 7,
  SEARCH = 8,
}
