import { Context, HonoRequest } from 'hono';

export class HttpExecutionContext {
  constructor(private readonly honoContext: Context) {}

  getRequest(): HonoRequest {
    return this.honoContext.req;
  }

  getResponse(): any {
    return this.honoContext.res;
  }
}
