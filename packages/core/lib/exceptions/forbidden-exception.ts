import { HttpStatus } from '../rest/http-server/status-codes';
import { HttpException } from './http-exception';

export class ForbiddenException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: number | HttpStatus = HttpStatus.FORBIDDEN,
  ) {
    super(response, status);
  }
}
