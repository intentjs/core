import { ArgumentsHost, HttpException, Type } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { IntentConfig } from '../config/service';
import { Log } from '../logger';
import { Request, Response } from '../rest';
import { Package } from '../utils';

export abstract class IntentExceptionFilter extends BaseExceptionFilter {
  abstract handleHttp(exception: any, req: Request, res: Response);

  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return '*';
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<any>();
    const response = ctx.getResponse<any>();

    this.reportToSentry(exception);

    Log().error('', exception);

    return this.handleHttp(exception, request.intent.req(), response);
  }

  reportToSentry(exception: any): void {
    const sentryConfig = IntentConfig.get('app.sentry');
    if (!sentryConfig?.dsn) return;

    const exceptionConstructor = exception?.constructor;
    const sentry = Package.load('@sentry/node');
    if (
      exceptionConstructor &&
      !this.doNotReport().includes(exceptionConstructor)
    ) {
      sentry.captureException(exception);
    }
  }
}
