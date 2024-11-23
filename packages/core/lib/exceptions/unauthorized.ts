import { HttpStatus } from '../rest';
import { HttpException } from './http-exception';

export class Unauthorized extends HttpException {
  constructor() {
    super('Unauthorized.', HttpStatus.UNAUTHORIZED);
  }
}
