import { Request } from '../rest';

export interface TransformableContextOptions {
  req?: Request;
  wsPayload?: Record<string, any>;
  include?: string;
}

export class TransformerContext {
  constructor(public options: TransformableContextOptions) {}

  getPayload(): Record<string, any> {
    if (this.options?.include) {
      return { include: this.options.include };
    }

    if (this.options?.req) {
      return this.options.req.all();
    }

    return this.options?.wsPayload;
  }
}
