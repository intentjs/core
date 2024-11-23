import { HttpStatus } from '../rest';
import { HttpException } from './http-exception';

export class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
  }
}
