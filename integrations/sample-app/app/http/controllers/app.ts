import { Controller, Get, Req } from '@intentjs/core';
import { UserService } from 'app/services';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getHello(@Req() req: Request) {
    console.log(req.body);
    return this.service.getHello();
  }
}
