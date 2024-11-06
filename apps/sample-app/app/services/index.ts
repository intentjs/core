import { __, Inject, Injectable } from '@intentjs/core';
import { UserDbRepository } from 'app/repositories/userDbRepository';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_DB_REPO') private readonly users: UserDbRepository,
  ) {}

  getHello(): string {
    return __('hello', { name: 'Intent' });
  }
}
