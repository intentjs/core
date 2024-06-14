import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationFailed extends HttpException {
  private errors: Record<string, any>;
  constructor(errors: Record<string, any>) {
    super(
      'Some entities failed, please check',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    this.errors = errors;
  }

  getErrors(): Record<string, any> {
    return this.errors;
  }
}
