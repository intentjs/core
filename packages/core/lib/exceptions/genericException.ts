import { HttpException } from './http-exception';

export class GenericException extends HttpException {
  constructor(message?: string) {
    message = message ? message : 'Something went wrong!';
    super(message, 403);
  }
}
