import { Context } from 'hono';

export class IntentRequestObj {
  constructor(
    public readonly param: Function,
    public readonly query: Function,
    public readonly queries: Function,
    public readonly header: Function,
  ) {}
}
