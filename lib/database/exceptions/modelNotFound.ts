import { HttpException } from '@nestjs/common';

export class ModelNotFound extends HttpException {
  constructor(modelName: string) {
    super(`${modelName} not found`, 404);
  }
}
