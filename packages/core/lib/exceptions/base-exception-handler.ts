import { ConfigService } from '../config/service';
import { Log } from '../logger';
import { Package } from '../utils';
import { Type } from '../interfaces';
import { HttpException } from './http-exception';
import { ValidationFailed } from './validation-failed';
import { HttpStatus } from '../rest/http-server/status-codes';
import { ExecutionContext } from '../rest/http-server/contexts/execution-context';
import { RouteNotFoundException } from './route-not-found-exception';

export abstract class IntentExceptionFilter {
  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return '*';
  }

  async catch(context: ExecutionContext, exception: any): Promise<any> {
    const ctx = context.switchToHttp();

    this.reportToSentry(exception);

    Log().error('', exception);

    return this.handleHttp(context, exception);
  }

  async handleHttp(context: ExecutionContext, exception: any): Promise<any> {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const debugMode = ConfigService.get('app.debug');

    if (exception instanceof RouteNotFoundException) {
      if (req.expectsJson()) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: exception.message,
          status: exception.getStatus(),
          // stack: debugMode && exception.stack,
        });
      }
    }

    if (exception instanceof ValidationFailed) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'validation failed',
        errors: exception.getErrors(),
      });
    }

    if (exception instanceof HttpException) {
      return res.status(exception.getStatus()).json({
        message: exception.message,
        status: exception.getStatus(),
        stack: debugMode && exception.stack,
      });
    }

    return res.status(this.getStatus(exception)).json(exception);
  }

  reportToSentry(exception: any): void {
    const sentryConfig = ConfigService.get('app.sentry');
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

  getStatus(exception: any): HttpStatus {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
