import { Context } from 'hono';

export class ResponseHandler {
  async handle(c: Context, res: any) {
    console.log(c, res);
    return ['json', res];
  }
}
