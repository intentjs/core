import { HttpStatus } from '../rest/http-server/status-codes';
import { HttpException } from './http-exception';

export class Unauthorized extends HttpException {
  constructor() {
    super('Unauthorized.', HttpStatus.UNAUTHORIZED);
  }
}
