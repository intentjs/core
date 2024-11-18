import { IController, IGet, Injectable, Req, Request } from '@intentjs/core';

@IController('/icon')
@Injectable()
export class IntentController {
  constructor() {}

  @IGet('/sample')
  async getHello(@Req() req: Request) {
    console.log(req);
    return { hello: 'world' };
  }
}
