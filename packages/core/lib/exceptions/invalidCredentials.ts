import { HttpException } from '@nestjs/common';

export class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid Credentials', 403);
  }
}
