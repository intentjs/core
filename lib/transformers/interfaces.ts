import { Request } from '../rest';

export interface TransformableContextOptions {
  req?: Request;
  wsPayload?: Record<string, any>;
  include?: string;
  user?: Record<string, any>;
}

export class TransformerContext {
  constructor(public options: TransformableContextOptions) {}

  getIncludes(): string {
    return this.options.include;
  }

  getUser(): Record<string, any> {
    return this.options.user;
  }
}
