import { DatabaseRepository, Injectable, InjectModel } from '@intentjs/core';
import { UserModel } from '../models/userModel';

@Injectable()
export class UserDbRepository extends DatabaseRepository<UserModel> {
  @InjectModel(UserModel)
  model: UserModel;
}
