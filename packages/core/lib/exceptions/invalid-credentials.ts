import { HttpStatus } from '../rest/http-server/status-codes';
import { HttpException } from './http-exception';

export class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
  }
}
