export type HttpRoute = {
  method: string;
  path: string;
  httpHandler?: any;
  middlewares?: any[];
};
