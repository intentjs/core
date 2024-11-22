import { Request, Response } from 'hyper-express';

export class HttpExecutionContext {
  constructor(
    private readonly request: Request,
    private readonly response: Response,
  ) {}

  getRequest(): Request {
    return this.request;
  }

  getResponse(): Response {
    return this.response;
  }
}
