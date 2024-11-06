import {
  Catch,
  HttpException,
  HttpStatus,
  IntentExceptionFilter,
  Request,
  Response,
  Type,
  ValidationFailed,
} from '@intentjs/core';

@Catch()
export class ApplicationExceptionFilter extends IntentExceptionFilter {
  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return '*';
  }

  handleHttp(exception: any, req: Request, res: Response) {
    if (exception instanceof ValidationFailed) {
      return res
        .status(422)
        .json({ message: 'validation failed', errors: exception.getErrors() });
    }

    return res.status(this.getStatus(exception)).json(exception);
  }

  getStatus(exception: any): HttpStatus {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
