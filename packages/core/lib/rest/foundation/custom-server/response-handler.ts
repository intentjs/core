import { Request, Response } from 'hyper-express';

export class ResponseHandler {
  async handle(hReq: Request, hRes: Response, res: any) {
    return ['json', res];
  }
}
