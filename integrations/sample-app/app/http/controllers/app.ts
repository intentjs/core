import { Controller, Get, Req } from '@intentjs/core';
import { OrderPlacedEvent } from 'app/events/events/sample-event';
import { UserService } from 'app/services';

@Controller('blogs')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async getHello(@Req() req: Request) {
    return { hello: 'Intent' };
  }

  @Get('hello/')
  async getHello2(@Req() req: Request) {
    const order = { id: 123, product: 'A book' };
    const event = new OrderPlacedEvent(order);
    event.emit();
    return { hello: 'Intent2' };
  }
}
