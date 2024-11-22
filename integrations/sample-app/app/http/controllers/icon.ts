import { IController, IGet, Injectable, Req, Request } from '@intentjs/core';
import {
  IPost,
  IUseGuards,
} from '@intentjs/core/dist/lib/rest/foundation/custom-server/decorators';
import { CustomGuard } from '../guards/custom';

@IController('/icon')
@Injectable()
@IUseGuards(CustomGuard)
export class IntentController {
  constructor() {}

  @IGet('/sample')
  @IUseGuards(CustomGuard)
  async getHello(@Req() req: Request) {
    console.log(req);
    return { hello: 'world' };
  }

  @IPost('/sample')
  @IUseGuards(CustomGuard)
  async postHello(@Req() req: Request) {
    return { hello: 'world' };
  }
}
