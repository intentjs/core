import { HttpException } from '@nestjs/common';

export class Unauthorized extends HttpException {
  constructor() {
    super('Unauthorized.', 401);
  }
}
