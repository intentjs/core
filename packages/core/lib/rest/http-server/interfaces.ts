export type HttpRoute = {
  method: string;
  path: string;
  httpHandler?: any;
  middlewares?: any[];
};

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  ANY = 'ANY',
}
