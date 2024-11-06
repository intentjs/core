import { HttpException } from '@nestjs/common';

export class GenericException extends HttpException {
  constructor(message?: string) {
    message = message ? message : 'Something went wrong!';
    super(message, 403);
  }
}
