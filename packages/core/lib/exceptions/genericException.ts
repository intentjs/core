import { HttpException } from './http-exception';
import { HttpStatus } from '../rest/http-server/status-codes';

export class GenericException extends HttpException {
  constructor(message?: string, status: HttpStatus = HttpStatus.FORBIDDEN) {
    message = message ? message : 'Something went wrong!';
    super(message, status);
  }
}
