import { ArgumentsHost, HttpException, HttpStatus, Type } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ValidationFailed } from "./validationfailed";
import { Package } from "../utils";
import { IntentConfig } from "../config/service";

export class IntentExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return "*";
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    const sentryConfig = IntentConfig.get("errors.sentry");
    sentryConfig?.dsn && this.reportToSentry(exception);

    if (exception instanceof ValidationFailed) {
      return response.status(exception.getStatus()).send(exception);
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

    return response.status(status).send(message);
  }

  reportToSentry(exception: any): void {
    const exceptionConstructor = exception?.constructor;
    const sentry = Package.load("@sentry/node");
    if (
      exceptionConstructor &&
      !this.doNotReport().includes(exceptionConstructor)
    ) {
      sentry.captureException(exception);
    }
  }
}
