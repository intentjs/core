import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationFailed, InvalidCredentials, GenericException } from '.';
import { Unauthorized } from './unauthorized';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<any> {
    return [
      NotFoundException,
      ValidationFailed,
      InvalidCredentials,
      GenericException,
      Unauthorized,
      UnauthorizedException,
    ];
  }

  catch(exception: any, host: ArgumentsHost) {
    console.error('ERRRR ==> ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    if (exception instanceof ValidationFailed) {
      return response.error(
        {
          message: exception.message,
          errors: exception.getErrors(),
        },
        exception.getStatus(),
      );
    }

    let message =
      exception.message || 'Something went wrong. Please try again later';

    const status = exception.status ? exception.status : 500;
    message = exception.status ? message : 'Internal Server Error';

    return response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }
}
